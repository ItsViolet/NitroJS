import fs from "fs-extra";
import ConfigToolsReadError from "./ConfigToolsReadError";

export { ConfigToolsReadError };

/**
 * Tools for managing configurations based on TypeScript and JavaScript
 */
export default class ConfigTools {
	/**
	 * Read a new JS/TS config
	 * @param filePath The path to the configuration
	 * @returns Promise containing the configuration as an object
	 */
	public static read<ConfigurationType>(filePath: string): Promise<ConfigurationType> {
		return new Promise((resolve, reject) => {
			let recursiveFilePath: ReturnType<typeof this.getFileRecursive>;

			try {
				recursiveFilePath = this.getFileRecursive(filePath);
			} catch (error) {
				reject(error);
				return;
			}

			if (recursiveFilePath.endsWith(".js")) {
				this.processJSConfig(recursiveFilePath)
					.then((config) => {
						resolve(config as any);
					})
					.catch((error) => {
						reject(error);
					});
			}
		});
	}

	/**
	 * Read a JS based config
	 * @param filePath File path to the JS config
	 * @returns A promise containing the config as an object
	 */
	private static processJSConfig(filePath: string): Promise<Object> {
		return new Promise((resolve, reject) => {
			import("file://" + filePath)
                .then((module) => {
                    if (typeof module != "object" || Array.isArray(module) || typeof module.default != "object" || Array.isArray(module.default)) {
                        reject(new Error(`${ConfigToolsReadError.objectNotExported} | The data type exported was not a JSON object`));
                        return;
                    }

                    if (typeof module["default"] == "undefined") {
                        reject(new Error(`${ConfigToolsReadError.noDefaultExport} | A default export was not provided`));
                        return;
                    }

					resolve(module.default);
				})
				.catch((error) => {
					reject(new Error(`${ConfigToolsReadError.configContainsErrors} | ${error.message}\n${error.stack}`));
				});
		});
	}

	/**
	 * Get the path to the config file, if it doesn't exist, it will try to find files with the same name but js/ts extension
	 * @param filePath The path to the file with an optional file extension
	 */
	private static getFileRecursive(filePath: string): string {
		let endResult: string;

		if (fs.existsSync(filePath) && (filePath.endsWith(".js") || filePath.endsWith(".ts"))) {
			endResult = filePath;
		} else if (filePath.endsWith(".js") && fs.existsSync(filePath.slice(0, -2) + "ts")) {
			endResult = filePath.slice(0, -2) + "ts";
		} else if (filePath.endsWith(".ts") && fs.existsSync(filePath.slice(0, -2) + "js")) {
			endResult = filePath.slice(0, -2) + "js";
		} else if (fs.existsSync(filePath + ".js")) {
			endResult = filePath + ".js";
		} else if (fs.existsSync(filePath + ".ts")) {
			endResult = filePath + ".ts";
		} else {
			throw new Error(
				`${ConfigToolsReadError.fileNotFound} | The file "${filePath}" could not be found with either .js or .ts extensions`
			);
		}

		if (fs.lstatSync(endResult).isDirectory()) {
			throw new Error(
				`${ConfigToolsReadError.pathIsDirectory} | The file path provided is a directory, but a file was expected`
			);
		}

		return endResult;
	}
}
