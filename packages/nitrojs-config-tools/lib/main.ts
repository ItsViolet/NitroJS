import { spawn } from "child_process";
import path from "path";
import fs from "fs-extra";
import objectTools from '@skylixgh/nitrojs-object-tools';
import commentJSON from "comment-json";
import YAML from "yaml";

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

export interface Settings {
    /**
     * All supported config types
     */
    supportedTypes: {
        /**
         * YAML configuration
         */
        yaml: boolean;

        /**
         * JSON configuration
         */
        json: boolean;

        /**
         * JavaScript configuration
         */
        js: boolean;

        /**
         * TypeScript configuration
         */
        ts: boolean;
    }
}

/**
 * Read a configuration file
 * @param configPath 
 * @returns Promise containing the config
 */
export function read<ConfigDataType>(configPath: string, defaultBaseConfig: ConfigDataType, settings: Partial<Settings> = {}): Promise<ConfigDataType> {
    return new Promise((resolve, reject) => {
        const options = objectTools.mergeObject<Settings, Partial<Settings>>({
            supportedTypes: {
                yaml: true,
                json: true,
                ts: true,
                js: true
            }
        }, settings);
        
        if (!fs.existsSync(configPath)) {
            reject(Errors.invalidFilePath);
            return;
        }

        const allowedToEndWith = {
            ts: ".ts",
            js: ".js",
            json: ".json",
            yaml: [ ".yml", ".yaml" ]
        };

        if (fs.lstatSync(configPath).isDirectory()) {
            reject(Errors.filePathWasDirectory);
            return;
        }

        if (configPath.endsWith(allowedToEndWith.ts) && options.supportedTypes.ts) {
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
        } else if (configPath.endsWith(allowedToEndWith.js) && options.supportedTypes.js) {
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
        } else if (configPath.endsWith(allowedToEndWith.json) && options.supportedTypes.json) {
            fs.readFile(configPath).then((jsonString) => {
                try {
                    const parsedJSON = commentJSON.parse(jsonString.toString());
                    resolve(parsedJSON);
                } catch (error) {
                    reject(Errors.fileContainsErrors);
                }
            });
        } else if ((configPath.endsWith(allowedToEndWith.yaml[0]) || configPath.endsWith(allowedToEndWith.yaml[1])) && options.supportedTypes.yaml) {
            fs.readFile(configPath).then((yamlString) => {
                try {
                    const yamlData = YAML.parse(yamlString.toString());
                    resolve(yamlData);
                } catch (error) {
                    reject(Errors.fileContainsErrors);
                }
            });
        } else {
            reject(Errors.unsupportedFileType);
        }
    });
}

const configTools = {
    read
}

export default configTools;
