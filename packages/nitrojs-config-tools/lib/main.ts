export enum Errors {
    /**
     * The file extension is unsupported
     */
    unsupportedFileType,

    /**
     * The file contains errors
     */
    fileContainsErrors,

    /**
     * The path to the file was invalid
     */
    invalidFilePath,

    /**
     * The file path provided was a directory instead
     */
    filePathWasDirectory
}

/**
 * Read a configuration file
 * @param configPath 
 * @returns Promise containing the config
 */
export function read<ConfigDataType>(configPath: string, defaultBaseConfig: ConfigDataType): Promise<ConfigDataType> {
    return new Promise((resolve, reject) => {

    });
}

const configTools = {
    read
}

export default configTools;
