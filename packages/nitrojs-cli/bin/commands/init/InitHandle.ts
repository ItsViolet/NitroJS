import Terminal, {
	TerminalAnimation,
	TerminalPromptBoolean,
	TerminalPromptSelect,
	TerminalPromptString,
} from "@skylixgh/nitrojs-terminal/src/Terminal";
import InitAnswers from "./interfaces/InitAnswers";
import semver from "semver";
import AppConfigType from "../../interfaces/AppConfigType";
import fs from "fs-extra";
import { program } from "commander";
import ini from "ini";
import path from "path";
import Generator from "./Generator";
import { Binary } from "../../Binary";

/**
 * Init command handler
 */
export default class InitHandle {
	/**
	 * Init command register
	 */
	public constructor() {
		program.command("init [path]").action((initPath) => {
			enum ProcessingAnimationNames {
				generatingPackage
			}

			TerminalAnimation.start([
				{
					label: "Generating package file",
					name: ProcessingAnimationNames.generatingPackage
				},
				
			])

			this.askAllInfo((projectAnswers) => {
				const packageFile = this.generatePackageJSON(projectAnswers);

				try {
					Generator.generatePackageFile(
						packageFile,
						initPath
							? path.join(process.cwd(), initPath, projectAnswers.project.name, "package.json")
							: path.join(process.cwd(), projectAnswers.project.name, "package.json")
					);
				} catch (error: any) {
					Terminal.error("Failed to generate package file");
					Binary.renderErrorException(error);
				}
			});
		});
	}

	/**
	 * Generate a package file from user input
	 * @param projectData Project data
	 * @returns Project package
	 */
	private generatePackageJSON(projectData: InitAnswers) {
		const projectPkg = {
			name: projectData.project.name,
			version: projectData.project.version,
			description: projectData.project.description,
			author: projectData.project.author,
			homepage: "" as any,
			license: projectData.project.license,
			main: "" as string | undefined,
			type: "module",
			directories: {
				src: "src",
			},
			files: ["src"],
			publishConfig: {
				access: "public",
			},
			repository: {
				type: "git",
				url: "git+https://github.com/<YourProject>.git",
			} as any,
			scripts: {
				start: "nitrojs dev",
				build: "nitrojs build",
			},
			bugs: {
				url: "https://github.com/<YourProject>/issues",
			} as any,
			depDependencies: {
				"@skylixgh/nitrojs-cli-service": "1.0.0-dev.1",
			} as any,
			dependencies: {} as any,
		};

		if (projectData.gitOriginUrl) {
			projectPkg.repository.url = projectData.gitOriginUrl;
			projectPkg.bugs.url = projectData.gitOriginUrl.slice(0, -4) + "/issues";
			projectPkg.homepage = projectData.gitOriginUrl.slice(0, -4) + "#readme";
		} else {
			delete projectPkg.repository;
			delete projectPkg.homepage;
			delete projectPkg.bugs;
		}

		if (projectData.typeScript && projectData.type != AppConfigType.node) {
			projectPkg.dependencies["typescript"] = "4.4.5";
		}

		if (projectData.type == AppConfigType.desktop) {
			projectPkg.main = "src/electron/Main";
		} else if (projectData.type == AppConfigType.node) {
			projectPkg.main = "src/Main";
		} else {
			delete projectPkg.main;
		}

		return projectPkg;
	}

	/**
	 * Ask all the init info
	 * @param callback Callback for when answers are done
	 */
	private askAllInfo(callback: (answers: InitAnswers) => void) {
		const result = { project: {} } as InitAnswers;

		const askOtherInfo = () => {
			TerminalPromptBoolean.prompt(
				"Use TypeScript?",
				(useTS) => {
					result.typeScript = useTS;

					let value: "NodeJS" | "Desktop" | "Mobile" | "Web";
					TerminalPromptSelect.prompt(
						"What type of application are you building",
						[
							{
								label: (value = "NodeJS"),
								value: value,
							},
							{
								label: (value = "Desktop"),
								value: value,
							},
							{
								label: (value = "Mobile"),
								value: value,
							},
							{
								label: (value = "Web"),
								value: value,
							},
						],
						(appType) => {
							switch (appType as typeof value) {
								case "NodeJS":
									result.type = AppConfigType.node;
									break;

								case "Desktop":
									result.type = AppConfigType.desktop;
									break;

								case "Mobile":
									result.type = AppConfigType.mobile;
									break;

								case "Web":
									result.type = AppConfigType.web;
									break;
							}

							TerminalPromptBoolean.prompt(
								"Detect GIT info",
								(detectGit) => {
									let rootPath = process.cwd();

									if (detectGit) {
										const maxParentTravel = 5;
										let currentTravelCount = 1;

										const travel = (base = false) => {
											currentTravelCount++;

											if (currentTravelCount > maxParentTravel) {
												return;
											}

											if (!base) {
												rootPath = path.join(rootPath, "../");
											}

											if (fs.existsSync(rootPath) && fs.lstatSync(rootPath).isDirectory()) {
												if (
													fs.existsSync(path.join(rootPath, ".git")) &&
													fs.existsSync(path.join(rootPath, ".git/config"))
												) {
													try {
														const parsedIni = ini.parse(
															fs.readFileSync(path.join(rootPath, ".git/config")).toString()
														);

														if (parsedIni[`remote "origin"`]) {
															result.gitOriginUrl = parsedIni[`remote "origin"`].url;
															callback(result);
														} else {
															result.gitOriginUrl = undefined;
															callback(result);
														}
													} catch {
														result.gitOriginUrl = undefined;
														callback(result);
													}
												} else {
													travel();
												}
											} else {
												travel();
											}
										};

										travel(true);
									} else {
										result.gitOriginUrl = undefined;
										callback(result);
									}
								},
								true
							);
						}
					);
				},
				true
			);
		};

		const askProjectInfo = () => {
			TerminalPromptString.prompt(
				"Project name",
				(name) => {
					result.project.name = name;
					// TODO: Validator handle

					TerminalPromptString.prompt("Project description", (desc) => {
						result.project.description = desc;

						TerminalPromptString.prompt(
							"Project version",
							(version) => {
								result.project.version = version;

								TerminalPromptString.prompt("Project author", (author) => {
									result.project.author = author;

									TerminalPromptString.prompt("Project keywords", (keywords) => {
										result.project.keywords = keywords.split(" ");

										TerminalPromptString.prompt("Project license", (license) => {
											result.project.license = license;
											askOtherInfo();
										});
									});
								});
							},
							"1.0.0",
							(answer) => {
								if (!semver.valid(answer)) {
									return "The version provided is not in a valid format, please visit https://semver.org for a proper version formatting guide";
								}
							}
						);
					});
				},
				"unnamed"
			);
		};

		askProjectInfo();
	}
}
