import AppConfig from "../interfaces/AppConfig";
import { Binary } from "../Binary";
import AppConfigType from "../interfaces/AppConfigType";
import CacheStore from "./cacheStore/CacheStore";
import fs from "fs-extra";
import path from "path";
import { TerminalAnimation, TerminalAnimationState } from "@skylixgh/nitrojs-terminal";
import { minify } from "terser";
import typeScript from "typescript";
import deepmerge from "deepmerge";
import { PartialDeep } from "type-fest";

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

		const defaultForConfig = (config: PartialDeep<AppConfig>) => {
			return deepmerge<AppConfig>({
				type: AppConfigType.node,
				node: {
					program: {
						args: []
					},
					excludes: []
				}
			}, config as any);
		};

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
		} else if (fs.existsSync((configPathFinal = path.join(process.cwd(), configPath + ".js")))) {
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
					`Failed to load the configuration, the "${configPath}" could not be found with ".ts" or ".js" extensions`
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

		function afterConfigFetch() {}

		if (isTS) {
			const renderTSError = (error: any) => {
				TerminalAnimation.stopAll(
					"config-loading",
					TerminalAnimationState.error,
					"Failed to load TypeScript based configuration"
				);
				Binary.renderErrorException(error);
			};

			try {
				const transpiled = typeScript.transpileModule(fs.readFileSync(configPathFinal).toString(), {
					compilerOptions: {
						target: typeScript.ScriptTarget.ESNext,
						module: typeScript.ModuleKind.ESNext,
					},
				}).outputText;

				minify(transpiled)
					.then((minified) => {
						fs.writeFileSync(path.join(CacheStore.location, "config/esm.js"), minified.code ?? "");

						import(`file://${path.join(CacheStore.location, "config/esm.js")}`)
							.then((configAsModule) => {
								if (Array.isArray(configAsModule.default)) {
									renderTSError(
										new Error("The default export is exporting an array but an object was expected")
									);
									process.exit(0);
								}

								if (typeof configAsModule.default != "object") {
									renderTSError(
										new Error(
											"The default export does not export an object, only object can be exported"
										)
									);
									process.exit(0);
								}

								TerminalAnimation.stopAll(
									"config-loading",
									TerminalAnimationState.success,
									"Successfully loaded TypeScript based configuration"
								);

								callback(defaultForConfig(configAsModule.default) as any);
							})
							.catch((error) => renderTSError(error));
					})
					.catch((error) => {
						renderTSError(error);
					});
			} catch (error) {
				renderTSError(error);
			}
		} else {
			const renderJSError = (error: any) => {
				TerminalAnimation.stopAll(
					"config-loading",
					TerminalAnimationState.error,
					"Failed to load JavaScript based configuration"
				);
				Binary.renderErrorException(error);
			};

			try {
				const jsConfig = fs.readFileSync(configPathFinal).toString();

				minify(jsConfig)
					.then((minified) => {
						CacheStore.writeStore("config/esm.js", minified.code ?? "");

						import(`file://${configPathFinal}`)
							.then((configAsModule) => {
								if (Array.isArray(configAsModule.default)) {
									renderJSError(
										new Error("The default export is exporting an array but an object was expected")
									);
									process.exit(0);
								}

								if (typeof configAsModule.default != "object") {
									renderJSError(
										new Error(
											"The default export does not export an object, only object can be exported"
										)
									);
									process.exit(0);
								}

								TerminalAnimation.stopAll(
									"config-loading",
									TerminalAnimationState.success,
									"Successfully loaded JavaScript based configuration"
								);
								callback(defaultForConfig(configAsModule.default) as any);
							})
							.catch((error) => {
								renderJSError(error);
							});
					})
					.catch((error) => {
						renderJSError(error);
					});
			} catch (error) {
				renderJSError(error);
			}
		}
	}
}
