import {
	TerminalAnimation,
	TerminalAnimationState,
	TerminalPromptSelect,
} from "@skylixgh/nitrojs-terminal";
import { program } from "commander";
import dns from "dns";
import { Binary } from "../../Binary";
import https from "https";
import fs from "fs";
import path from "path";
import semver from "semver";

/**
 * Command handler for the add command
 */
export default class AddHandle {
	/**
	 * Add command entry
	 */
	public constructor() {
		program.command("add <frameworkComponent>").action((frameworkComponent) => {
			enum ProcessAnimationValues {
				internet,
				componentExists,
				packageExists,
			}

			TerminalAnimation.start([
				{
					label: "Checking internet connection",
					name: ProcessAnimationValues.internet,
				},
				{
					label: `Checking is "@skylixgh/nitrojs-${frameworkComponent}" exists`,
					name: ProcessAnimationValues.componentExists,
				},
				{
					label: "Checking to see if your package file exists",
					name: ProcessAnimationValues.packageExists,
				},
			]);

			const networkErrorMsg =
				"Failed to resolve network host, please check your network connection";

			dns.resolve("registry.npmjs.com", (error) => {
				if (error) {
					TerminalAnimation.stopAll(
						ProcessAnimationValues.internet,
						TerminalAnimationState.error,
						networkErrorMsg
					);

					Binary.renderErrorException(error);
					return;
				}

				dns.resolve("api.github.com", (error) => {
					if (error) {
						TerminalAnimation.stopAll(
							ProcessAnimationValues.internet,
							TerminalAnimationState.error,
							networkErrorMsg
						);

						Binary.renderErrorException(error);
						return;
					}

					TerminalAnimation.stop(
						ProcessAnimationValues.internet,
						TerminalAnimationState.success,
						"Successfully validated network connection"
					);
					this.fetchIfExists(
						`https://registry.npmjs.com/@skylixgh/nitrojs-${frameworkComponent}`,
						(error, packageInfo) => {
							if (!error && packageInfo != undefined) {
								TerminalAnimation.stop(
									ProcessAnimationValues.componentExists,
									TerminalAnimationState.success,
									`"@skylixgh/nitrojs-${frameworkComponent}" was found on the registry`
								);

								try {
									const appPackage = JSON.parse(
										fs.readFileSync(path.join(process.cwd(), "package.json")).toString()
									);

									TerminalAnimation.stop(
										ProcessAnimationValues.packageExists,
										TerminalAnimationState.success,
										"Successfully found app package"
									);

									if (!appPackage.hasOwnProperty("dependencies")) {
										appPackage.dependencies = {};
									}

									let includesNightly = false;
									let includesRelease = false;
									let includesBeta = false;
									let includesAlpha = false;

									for (const versionName in packageInfo.versions) {
										const preRel = semver.prerelease(versionName);

										if (preRel && preRel[0] == "dev") {
											includesNightly = true;
										} else if (preRel && preRel[0] == "alpha") {
											includesAlpha = true;
										} else if (preRel && preRel[0] == "beta") {
											includesBeta = true;
										} else {
											includesRelease = true;
										}
									}

									const promptOptions = [] as any[];

									if (includesAlpha) {
										promptOptions.push({
											label: "Alpha",
											name: "alpha",
										});
									}

									if (includesBeta) {
										promptOptions.push({
											label: "Beta",
											name: "beta",
										});
									}

									if (includesNightly) {
										promptOptions.push({
											label: "Nightly",
											name: "nightly",
										});
									}

									if (includesRelease) {
										promptOptions.push({
											label: "Latest",
											name: "latest",
										});
									}

									TerminalPromptSelect.prompt(
										"Release type",
										promptOptions as any,
										(releaseType) => {}
									);

									appPackage.dependencies[`@skylixgh/nitrojs-${frameworkComponent}`] = "";
								} catch (error) {
									TerminalAnimation.stopAll(
										ProcessAnimationValues.packageExists,
										TerminalAnimationState.error,
										"Your package file could not be found"
									);

									Binary.renderErrorException(error);
								}
							} else if (error) {
								TerminalAnimation.stopAll(
									ProcessAnimationValues.componentExists,
									TerminalAnimationState.error,
									"Failed to get information about the framework"
								);
								Binary.renderErrorException(error);
							} else {
								TerminalAnimation.stopAll(
									ProcessAnimationValues.componentExists,
									TerminalAnimationState.error,
									`Failed to add "@skylixgh/nitrojs-${frameworkComponent}" because that isn't a valid framework component`
								);
							}
						}
					);
				});
			});
		});
	}

	/**
	 * See if a package exists on Npm and then receive the package
	 * @param url The registry URL
	 * @param callback The answer callback
	 */
	private fetchIfExists(url: string, callback: (error: Error | any, packageInfo: any) => void) {
		let fullResponse = "";

		try {
			https
				.request(url, (response) => {
					response.on("data", (chunk) => (fullResponse += chunk));

					response.on("end", () => {
						try {
							const jsonParsed = JSON.parse(fullResponse);

							if (jsonParsed["error"]) {
								throw new Error("The package could not be found");
							}

							callback(undefined, jsonParsed);
						} catch (error) {
							callback(error, undefined);
						}
					});
				})
				.on("error", (error) => {
					callback(error, undefined);
				})
				.end();
		} catch (error) {
			callback(error, undefined);
		}
	}
}
