import terminal from "@skylixgh/nitrojs-terminal";

export enum FlagType {
    string,
    boolean,
    number,
    arrayString,
    arrayNumber,
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
    flags: {
        [index: string]: {
            type: FlagType;
        };
    };
}

interface BinItem {
    command: Command;
    trigger: string;
    handle: (args: string, flags: any) => void;
}

const commandBins = [] as Command[];

export function registerNew(trigger: BinItem["trigger"], command: Partial<Command> = {}, handle: BinItem["handle"]) {}

const cliBuilder = {};

export default cliBuilder;
