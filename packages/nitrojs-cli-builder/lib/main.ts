import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import objectTools, { ObjectType } from '@skylixgh/nitrojs-object-tools';

export enum FlagType {
    /**
     * String data type
     */
    string,

    /**
     * Boolean data type
     */
    boolean,

    /**
     * Number data type
     */
    number,

    /**
     * A string array data type
     */
    arrayString,

    /**
     * A number array data type
     */
    arrayNumber,

    /**
     * A boolean array data type
     */
    arrayBoolean
}

interface YargsArgvOutput {
    /**
     * All arguments
     */
    _: string[];

    /**
     * All flags and values
     */
    [index: string]: any;

    /**
     * Bin
     */
    $0: any;
}

export interface Command {
    /**
     * All command flags
     */
    flags: {
        [index: string]: {
            /**
             * The flag data type
             */
            type: FlagType;

            /**
             * If the flag should be required
             */
            require?: boolean;

            /**
             * The default flag value
             */
            default?: any;
        };
    };
}

interface BinItem {
    /**
     * Command options
     */
    command: Command;

    /**
     * Command trigger
     */
    trigger: string;

    /**
     * Command trigger
     */
    handle: (args: string[], flags: ObjectType) => void;
}

const commandBins = [] as BinItem[];
let programVersion = "0.0.0";
let programName = "CLI Program";
let programAuthor = "Unknown";

/**
 * Register a new command
 * @param trigger The command trigger
 * @param command The command options
 * @param handle The command handler
 */
export function registerNew(trigger: BinItem["trigger"], command: Partial<Command> = {}, handle: BinItem["handle"]) {
    commandBins.push({
        trigger,
        command: objectTools.mergeObject<Command, Partial<Command>>({
            flags: {}
        }, command),
        handle
    });
}

/**
 * Set the program version
 * @param version The program version
 */
export function setVersion(version: string) {
    programVersion = version;
}

/**
 * Set the program author
 * @param author The program author
 */
export function setAuthor(author: string) {
    programAuthor = author;
}

/**
 * Set the program name
 * @param name The program name
 */
export function setName(name: string) {
    programName = name;
}

/**
 * Get a command with its trigger
 * @param trigger The command's trigger
 * @returns The command, undefined if the command was not found
 */
function getCommandBin(trigger: string): BinItem | undefined {
    const results = commandBins.find(item => item.trigger == trigger);

    if (results) {
        return results;
    }

    return;
}

/**
 * Filter the object so that only the flags are left
 * @param parsed The yargs parsed output
 */
function filterFlags(parsed: YargsArgvOutput): ObjectType {
    const resultObj = {} as ObjectType;

    for (const flagName in parsed) {
        if (flagName != "_" && flagName != "$0") {
            resultObj[flagName] = parsed[flagName];
        }
    }

    return resultObj;
}

/**
 * Execute the command app
 * @param argv Program arguments
 */
export function execute(argv: typeof process.argv) {
    const args = hideBin(argv);
    const parsed = yargs.help(false).parse(args) as YargsArgvOutput;
    const flags = filterFlags(parsed);

    console.log(parsed);
    console.log(getCommandBin(parsed._[0]));

    if (parsed._[0]) {
        const commandBin = getCommandBin(parsed._[0]);
        return;
    }

    if (flags.version) {
        
        return;
    }

    // TODO: Render help page
}

const cliBuilder = {
    registerNew,
    execute,
    setVersion,
    setAuthor,
    setName
};

export default cliBuilder;
