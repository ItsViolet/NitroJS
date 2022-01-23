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
		this.generateDir(filePath);
		fs.writeFileSync(filePath, JSON.stringify(packageObject, null, 2) + "\n");
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
        fs.writeFileSync(
            filePath,
            this.getLocalResource(".gitignore.txt")
        )
    }

    /**
     * Get a resource file as a string
     * @param resourcePath Resource path relative to root of resources
     * @returns Resource contents
     */
    private static getLocalResource(resourcePath: string) {
        return fs.readFileSync(
            path.join(
                __dirname,
                resourcePath
            )
        ).toString();
    }
}
