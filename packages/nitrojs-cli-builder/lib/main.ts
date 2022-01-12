import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import objectTools from '@skylixgh/nitrojs-object-tools';

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
    command: Command;
    trigger: string;
    handle: (args: string, flags: any) => void;
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
 * Execute the command app
 */
export function execute(argv: typeof process.argv) {
    const args = hideBin(argv);
}

const cliBuilder = {
    registerNew,
    execute
};

export default cliBuilder;
