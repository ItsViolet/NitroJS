import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import objectTools, { DeepPartial, ObjectType } from "@skylixgh/nitrojs-object-tools";
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
            required?: boolean;
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
export function registerNew(trigger: BinItem["trigger"], command: DeepPartial<Command> = {}, handle: BinItem["handle"]) {
    commandBins.push({
        trigger,
        command: objectTools.mergeObject<Command>(
            {
                flags: {}
            },
            command,
            true
        ),
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
    const results = commandBins.find((item) => item.trigger == trigger);

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

export interface ArrayErrorFlag {
    /**
     * The expected data type
     */
    expected: FlagType;

    /**
     * The flag name
     */
    flag: string;

    /**
     * The array element where the type error happened
     */
    index: number;
}

/**
 * Type check process on all flags
 * @param flags The flags
 * @param commandObject The bin item
 * @returns The error types
 */
function typeCheckAllFlags(
    commandFlags: ObjectType,
    commandObject: BinItem
): { errors: ErrorFlag[]; trueValues: ObjectType; arrayErrors: ArrayErrorFlag[] } {
    let errorFlags = [] as ErrorFlag[];
    let trueValues: ObjectType = {};
    let arrayErrorFlags = [] as ArrayErrorFlag[];

    for (const commandFlagName in commandFlags) {
        let arrayExpected = false;
        const commandFlag = commandFlags[commandFlagName];
        const expectedType = commandObject.command.flags[commandFlagName].type;

        if (expectedType == FlagType.arrayBoolean || expectedType == FlagType.arrayNumber || expectedType == FlagType.arrayString) {
            arrayExpected = true;
        }

        const pushFlagError = () => {
            errorFlags.push({
                expected: expectedType,
                flag: commandFlagName
            });
        };

        if (!arrayExpected) {
            if (Array.isArray(commandFlag)) {
                pushFlagError();
            } else {
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
                        pushFlagError();
                    }
                }

                if (expectedType == FlagType.number) {
                    if (!isNaN(flagValue as any)) {
                        trueValues[commandFlagName] = +flagValue;
                    } else {
                        pushFlagError();
                    }
                }
            }
        } else if (arrayExpected) {
            if (Array.isArray(commandFlag)) {
                commandFlag.forEach((arrayItem, index) => {
                    const arrayStringItem = arrayItem + "";

                    if (!trueValues[commandFlagName]) {
                        trueValues[commandFlagName] = [] as string[];
                    }

                    if (expectedType == FlagType.arrayString) {
                        trueValues[commandFlagName].push(arrayStringItem);
                    }

                    if (expectedType == FlagType.arrayBoolean) {
                        if (arrayStringItem.toLowerCase() == "true") {
                            trueValues[commandFlagName].push(true);
                        } else if (arrayStringItem.toLowerCase() == "false") {
                            trueValues[commandFlagName].push(false);
                        } else {
                            arrayErrorFlags.push({
                                flag: commandFlagName,
                                expected: FlagType.boolean,
                                index
                            });
                        }
                    }

                    if (expectedType == FlagType.arrayNumber) {
                        if (!isNaN(commandFlag as any)) {
                            trueValues[commandFlagName].push(+commandFlag);
                        } else {
                            arrayErrorFlags.push({
                                expected: FlagType.number,
                                flag: commandFlagName,
                                index
                            });
                        }
                    }
                });
            } else {
                pushFlagError();
            }
        }
    }

    return {
        errors: errorFlags,
        trueValues: trueValues,
        arrayErrors: arrayErrorFlags
    };
}

/**
 * Find out what flags are missing and invalid
 * @param flags All user input flags
 * @param commandBin The command binary object
 * @returns The invalid and missing flag names
 */
function runParamChecking(flags: ObjectType, commandBin: BinItem): { invalidFlags: string[]; missingFlags: string[] } {
    const missingFlags = [] as string[];
    const invalidFlags = [] as string[];
    const flagKeys = Object.keys(flags);
    const commandFlagKeys = Object.keys(commandBin.command.flags);

    flagKeys.forEach((flagName) => {
        if (!commandBin.command.flags.hasOwnProperty(flagName)) {
            invalidFlags.push(flagName);
        }
    });

    commandFlagKeys.forEach((commandFlagName) => {
        if (commandBin.command.flags[commandFlagName].required && !flags.hasOwnProperty(commandFlagName)) {
            missingFlags.push(commandFlagName);
        }
    });

    return {
        missingFlags,
        invalidFlags
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
            const paramErrors = runParamChecking(flags, commandBin);

            if (paramErrors.invalidFlags.length == 0 && paramErrors.missingFlags.length == 0) {
                const typeData = typeCheckAllFlags(flags, commandBin);

                if (typeData.errors.length > 0) {
                    typeData.errors.forEach((typeError) => {
                        terminal.error(
                            `Type error in flag: ${terminal.hexColorize(`--${typeError.flag}`, "#999999")} expected a(n) ${Object.keys(FlagType).find(
                                (key) => FlagType[key as any] == (typeError.expected as any)
                            )}`
                        );
                    });
                }

                if (typeData.arrayErrors) {
                    typeData.arrayErrors.forEach((arrayError) => {
                        terminal.error(
                            `Type error in array flag: ${terminal.hexColorize(`--${arrayError.flag}`, "#999999")} expected a ${Object.keys(
                                FlagType
                            ).find((key) => FlagType[key as any] == (arrayError.expected as any))} on index ${arrayError.index} of array`
                        );
                    });
                }

                if (typeData.arrayErrors.length == 0 && typeData.errors.length == 0) {
                    commandBin.handle(parsed._.splice(1), flags);
                }
                return;
            }

            if (paramErrors.invalidFlags.length > 0) terminal.error(`Invalid flags: ${paramErrors.invalidFlags.join(", ")}`);

            if (paramErrors.missingFlags.length > 0) terminal.error(`Missing flags: ${paramErrors.missingFlags.join(", ")}`);
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
