import AppConfig from "../interfaces/AppConfig";
import ConfigTools from "@skylixgh/nitrojs-config-tools";
import { Binary } from "../Binary";
import deepmerge from "deepmerge";
import AppConfigType from "../interfaces/AppConfigType";
import { PartialDeep } from "type-fest";
import CacheStore from "./cacheStore/CacheStore";
import fs from "fs-extra";
import path from "path";
import { TerminalAnimation, TerminalAnimationState } from "@skylixgh/nitrojs-terminal";

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
		TerminalAnimation.start([
			{
				label: "Loading your configuration",
				name: "config-loading",
			},
		]);

		CacheStore.writeStore("config/meta.json", "{}");

		let configPathFinal = "";
		let isTS = false;

		if (configPath.endsWith(".ts")) {
			configPathFinal = path.join(process.cwd(), configPath);
			isTS = true;
		} else if (fs.existsSync(path.join(process.cwd(), configPath + ".ts"))) {
			configPathFinal = path.join(process.cwd(), configPath + ".ts");
			isTS = true;
		} else if (configPath.endsWith(".js")) { 
			configPathFinal = path.join(process.cwd(), configPath);
		} else if (fs.existsSync(configPathFinal = path.join(process.cwd(), configPath + ".js"))) { 
			configPathFinal = path.join(process.cwd(), configPath + ".js");
		} else {
			if (
				!fs.existsSync(path.join(process.cwd(), configPath + ".js")) ||
				!configPath.endsWith(".js") ||
				!fs.existsSync(path.join(process.cwd(), configPath + ".ts")) ||
				!configPath.endsWith(".ts")
			) {
				TerminalAnimation.stopAll(
					"config-loading",
					TerminalAnimationState.error,
					`Failed to load the configuration, the "nitrojs.config" could not be found with ".ts" or ".js" extensions`
				);

				process.exit(0);
			}
		}

		CacheStore.writeStore(
			"config/meta.json",
			JSON.stringify({
				type: isTS ? "TypeScript" : "JavaScript",
			})
		);

		callback({
			type: AppConfigType.node,
		});
	}
}
