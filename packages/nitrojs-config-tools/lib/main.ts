import { spawn } from "child_process";
import path from "path";
import fs from "fs-extra";
import objectTools from '@skylixgh/nitrojs-object-tools';
import commentJSON from "comment-json";

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
    filePathWasDirectory,

    /**
     * A default export was not provided or provided correctly
     */
    incorrectExportOrNone
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

        if (configPath.endsWith(allowedToEndWith.ts)) {
            const readerProcess = spawn("node", [ path.join(__dirname, "./services/readTSBasedConfig.js"), configPath ],);

            readerProcess.stdout.on("data", (data: Buffer) => {
                objectTools.jsonParse<any>(data.toString()).then((jsonData) => {
                    if (!jsonData.hasOwnProperty("default")) {
                        reject(Errors.incorrectExportOrNone);
                        return;
                    }

                    resolve(objectTools.mergeObject(defaultBaseConfig, jsonData.default));
                });
            });

            readerProcess.stderr.on("data", (data: Buffer) => {
                readerProcess.kill();
                reject(Errors.fileContainsErrors);
            });
        } else if (configPath.endsWith(allowedToEndWith.js)) {
            const readerProcess = spawn("node", [ path.join(__dirname, "./services/readTSBasedConfig.js"), configPath ],);

            readerProcess.stdout.on("data", (data: Buffer) => {
                objectTools.jsonParse<any>(data.toString()).then((jsonData) => {
                    if (Object.keys(jsonData).length == 0) {
                        reject(Errors.incorrectExportOrNone);
                        return;
                    }

                    resolve(objectTools.mergeObject(defaultBaseConfig, jsonData));
                });
            });

            readerProcess.stderr.on("data", (data: Buffer) => {
                readerProcess.kill();
                reject(Errors.fileContainsErrors);
            });
        } else if (configPath.endsWith(allowedToEndWith.json)) {
            fs.readFile(configPath).then((jsonString) => {
                try {
                    const parsedJSON = commentJSON.parse(jsonString.toString());
                    resolve(parsedJSON);
                } catch (error) {
                    reject(Errors.fileContainsErrors);
                }
            });
        }
    });
}

const configTools = {
    read
}

export default configTools;
