import fs from "fs-extra";

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
            const recursiveFilePath = this.getFileRecursive(filePath);
            
            if (!recursiveFilePath) {
                const error = new Error(`The file "${filePath}" could not be found with either .js or .ts extensions`);
                error.name = 
            }
		});
	}

	/**
	 * Get the path to the config file, if it doesn't exist, it will try to find files with the same name but js/ts extension
	 * @param filePath The path to the file with an optional file extension
	 */
	private static getFileRecursive(filePath: string): string | null {
		let endResult = null as string | null;

		if (fs.existsSync(filePath)) {
			endResult = filePath;
		} else if (filePath.endsWith(".js") && fs.existsSync(filePath.slice(0, -2) + ".ts")) {
			endResult = filePath.slice(0, -2) + ".ts";
		} else if (filePath.endsWith(".ts") && fs.existsSync(filePath.slice(0, -2) + ".js")) {
            endResult = filePath.slice(0, -2) + ".js";
        } else if (fs.existsSync(filePath + ".js")) {
            endResult = filePath + ".js";
        } else if (fs.existsSync(filePath + ".ts")) {
            endResult = filePath + ".ts";
        }
        
		return endResult;
	}
}
