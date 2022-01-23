import fs from "fs";
import path from "path";

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
		if (!fs.existsSync(path.dirname(filePath))) {
			fs.mkdirSync(path.dirname(filePath), {
				recursive: true,
			});
		} else if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
			fs.mkdirSync(path.dirname(filePath), {
				recursive: true,
			});
		}

		fs.writeFileSync(filePath, JSON.stringify(packageObject, null, 2) + "\n");
	}
}
