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
            fs.mkdir(path.join(projectRoot, ".nitrojs"), {
                recursive: true
            });
            
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
}