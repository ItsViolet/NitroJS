import AppConfig from "../../../interfaces/AppConfig";
import ConfigTools from "@skylixgh/nitrojs-config-tools";
import { Binary } from "../../../Binary";
import deepmerge from "deepmerge";
import AppConfigType from "../../../interfaces/AppConfigType";
import { PartialDeep } from "type-fest";
import CacheStore from "../../../utils/cacheStore/CacheStore";

/**
 * Utility methods
 */
export default class Utils {
	/**
	 * Read a user config
	 * @param configPath The configuration path relative to current CWD
	 * @param callback The callback for when the config is processes
	 */
	public static readConfig(configPath: string, callback: (config: AppConfig) => void) {
        callback({
            type: AppConfigType.node
        });
	}
}
