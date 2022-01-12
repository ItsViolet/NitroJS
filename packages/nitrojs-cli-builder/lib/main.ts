import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import objectTools, { ObjectType } from '@skylixgh/nitrojs-object-tools';
import { dump } from './../../nitrojs-object-tools/lib/main';

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
 * Execute the command app
 * @param argv Program arguments
 */
export function execute(argv: typeof process.argv) {
    const args = hideBin(argv);
    const parsed = yargs.help(false).parse(args) as YargsArgvOutput;

    console.log(getCommandBin(parsed._[0]));
}

const cliBuilder = {
    registerNew,
    execute
};

export default cliBuilder;
