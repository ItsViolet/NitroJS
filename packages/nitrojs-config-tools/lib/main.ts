import { spawn } from "child_process";
import path from "path";
import fs from "fs-extra";

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
        if (!fs.existsSync(configPath)) {
            reject(Errors.invalidFilePath);
            return;
        }

        const allowedToEndWith = {
            ts: ".ts",
            js: ".js",
            json: ".json",
            yaml: ".yml"
        }

        if (
            !configPath.endsWith(allowedToEndWith.ts) 
            && !configPath.endsWith(allowedToEndWith.js) 
            && !configPath.endsWith(allowedToEndWith.json) 
            && !configPath.endsWith(allowedToEndWith.yaml)
        ) {
            reject(Errors.unsupportedFileType);
            return;
        }

        if (fs.lstatSync(configPath).isDirectory()) {
            reject(Errors.filePathWasDirectory);
            return;
        }

        if (configPath.endsWith(".ts")) {
            const readerProcess = spawn("node", [ path.join(__dirname, "./services/readTSBasedConfig.js"), configPath ]);
        }
    });
}

const configTools = {
    read
}

export default configTools;
