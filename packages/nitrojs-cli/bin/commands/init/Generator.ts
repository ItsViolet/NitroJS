import fs from "fs";
import path from "path";
import AppConfigType from "../../interfaces/AppConfigType";
import InitAnswers from "./interfaces/InitAnswers";
import gitignore from "./resources/gitignore";
import MainScriptTS from "./resources/typescript/node/Main";
import MainScriptJS from "./resources/javascript/node/Main";

/**
 * Class used for generating project resources
 */
export default class Generator {
	/**
	 * Generate the package file
	 * @param packageObject The package
	 * @param filePath The location for the file
	 */
	public static generatePackageFile(packageObject: Object, filePath: string) {
		this.generateDir(filePath);
		fs.writeFileSync(filePath, JSON.stringify(packageObject, null, 4) + "\n");
	}

	/**
	 * Generate the directory for a file path
	 * @param filePath File path
	 */
	private static generateDir(filePath: string) {
		if (!fs.existsSync(path.dirname(filePath))) {
			fs.mkdirSync(path.dirname(filePath), {
				recursive: true,
			});
		} else if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
			fs.mkdirSync(path.dirname(filePath), {
				recursive: true,
			});
		}
	}

	/**
	 * Generate a gitignore file
	 * @param filePath The file directory for the ignore list
	 */
	public static generateIgnoreList(filePath: string) {
		this.generateDir(filePath);
		fs.writeFileSync(filePath, gitignore);
	}

	/**
	 * Generate default source files for app
	 * @param rootDir App root dir
	 * @param initAnswers All init answers
	 */
	public static generateSourceFiles(rootDir: string, initAnswers: InitAnswers) {
		if (initAnswers.type == AppConfigType.node) {
			this.generateDir(path.join(rootDir, "src/blank.txt"));

			if (initAnswers.typeScript) {
				fs.writeFileSync(path.join(rootDir, "src/Main.ts"), MainScriptTS);
			} else {
				fs.writeFileSync(path.join(rootDir, "src/Main.js"), MainScriptJS);
			}
		} else {
			// TODO: Ofc you know
			throw new Error(
				"Cannot generate source files for this app, this version of the CLI isn't ready for apps like this"
			);
		}
	}
}
