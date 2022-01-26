import fs from "fs-extra";
import path from "path";
import { Binary } from "../../Binary";

/**
 * The cache store for the NodeJS project
 */
export default class CacheStore {
	/**
	 * The NitroJS cache resource path
	 */
	private static _location = "";

	/**
	 * Initialize the cache store
	 * @param projectRoot Project root dir
	 */
	public static initialize(projectRoot: string) {
		try {
			if (!fs.existsSync(path.join(projectRoot, ".nitrojs"))) {
				fs.mkdirSync(path.join(projectRoot, ".nitrojs"), {
					recursive: true,
				});
			}

			this._location = path.join(projectRoot, ".nitrojs");
		} catch (error) {
			Binary.renderErrorException(error);
		}
	}

	/**
	 * NitroJS cache resource location
	 */
	public static get location() {
		return this._location;
	}

	/**
	 * Write a cache record
	 * @param pathRelativeToCacheRoot Path that is relative to the .nitrojs folder
	 * @param dataContents The contents of the cache file
	 * @returns The directory or file path of the new record
	 */
	public static writeStore(pathRelativeToCacheRoot: string, dataContents: string): string {
		pathRelativeToCacheRoot = path.join(this._location, pathRelativeToCacheRoot);

		const afterDirReady = () => {
			fs.writeFileSync(pathRelativeToCacheRoot, dataContents, {});
		};

		fs.mkdir(path.dirname(pathRelativeToCacheRoot), {
			recursive: true,
		});

		afterDirReady();

		return pathRelativeToCacheRoot;
	}

	/**
	 * Create a new cache dir
	 * @param dirPath The path to the directory relative to the cache root
	 */
	public static writeStoreDir(dirPath: string) {
		try {
			fs.mkdir(path.join(this._location, dirPath), {
				recursive: true,
			});
		} catch {}
	}

	/**
	 * Delete a cache dir
	 * @param dirPath The path to the directory relative to the cache root
	 */
	public static deleteStoreDir(dirPath: string) {
		try {
			fs.unlinkSync(path.join(this._location, dirPath));
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * Delete a cache record
	 * @param record The record path relative to cache root
	 */
	public static deleteStore(record: string) {
		try {
			fs.unlinkSync(path.join(this._location, record));
		} catch {}
	}
}
