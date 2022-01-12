import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import objectTools, { ObjectType } from '@skylixgh/nitrojs-object-tools';
import terminal from "@skylixgh/nitrojs-terminal";

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
    arrayBoolean,

    /**
     * An object data type
     */
    object
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
 * Get the process argv
 * @returns The process argv
 */
export function getArgv(): [string, string, ...[string]] {
    return process.argv as any;
}

interface ErrorFlag {
    /**
     * The expected flag type
     */
    expected: FlagType;

    /**
     * The flag name
     */
    flag: string;
}

/**
 * Type check process on all flags
 * @param flags The flags
 * @param commandObject The bin item
 * @returns The error types
 */
function typeCheckAllFlags(commandFlags: ObjectType, commandObject: BinItem): { errors: ErrorFlag[], trueValues: ObjectType } {
    let errorFlags = [] as ErrorFlag[];
    let trueValues: ObjectType = {};
    
    for (const commandFlagName in commandFlags) {
        let arrayExpected = false;
        const commandFlag = commandFlags[commandFlagName];
        const expectedType = commandObject.command.flags[commandFlagName].type;

        if (expectedType == FlagType.arrayBoolean || expectedType == FlagType.arrayNumber || expectedType == FlagType.arrayString) {
            arrayExpected = true;
        }

        if (!arrayExpected) {
            const flagValue = commandFlag + "";

            if (expectedType == FlagType.string) {
                trueValues[commandFlagName] = flagValue;
            }

            if (expectedType == FlagType.boolean) {
                if (flagValue.toLocaleLowerCase() == "true") {
                    trueValues[commandFlagName] = true;
                } else if (flagValue.toLocaleLowerCase() == "false") {
                    trueValues[commandFlagName] = false;
                } else {
                    errorFlags.push({
                        expected: expectedType,
                        flag: commandFlagName
                    });
                }
            }
        }
    }

    return {
        errors: errorFlags,
        trueValues: trueValues
    };
}

/**
 * Execute the command app
 * @param argv Program arguments
 */
export function execute(argv: [string, string, ...[string]]) {
    const args = hideBin(argv);
    const parsed = yargs.help(false).version(false).parse(args) as YargsArgvOutput;
    const flags = filterFlags(parsed);

    if (parsed._[0]) {
        const commandBin = getCommandBin(parsed._[0]);

        if (commandBin) {
            const errorFlags = typeCheckAllFlags(flags, commandBin);
            console.log(errorFlags);

            return;
        }

        terminal.error(`Unknown command: "${parsed._[0]}"`);
        return;
    }

    if (Object.keys(flags).length >= 1) {
        if (flags.version) {
            terminal.log(`${programName} - ${programVersion}`);
            return;
        }

        terminal.error(`Unexpected flags: "${Object.keys(flags).join(", ")}"`);
        return;
    }

    // TODO: Render help page
    terminal.log(`${programName} - ${programVersion}`);
    terminal.log("Help page has not been implemented");
}

const cliBuilder = {
    registerNew,
    execute,
    setVersion,
    setAuthor,
    setName,
    getArgv
};

export default cliBuilder;
