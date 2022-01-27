import CommandFlags from "../CommandFlags";
import typeScript from "typescript";
import fs from "fs-extra";
import AppConfig from "../../../interfaces/AppConfig";
import chokidar, { FSWatcher } from "chokidar";
import { ChildProcess } from "child_process";
import Terminal, { TerminalPrompt } from "@skylixgh/nitrojs-terminal";
import path from "path";
import CacheStore from "../../../utils/cacheStore/CacheStore";
import { Binary } from "../../../Binary";
import ScriptVirtualMachine from "./ScriptVirtualMachine";
import readline from "readline";
import { spawn } from "child_process";

/**
 * Class for handling NodeJS based dev server applications
 */
export default class Node {
	/**
	 * The file change watchers
	 */
	private fileWatcher: FSWatcher | null = null;

	/**
	 * The script main child process
	 */
	private applicationProcess: ChildProcess | null = null;

	/**
	 * NodeJS dev server controller
	 * @param flags Command flags
	 * @param projectRoot Project root
	 * @param config App config
	 */
	public constructor(flags: CommandFlags, projectRoot: string, config: AppConfig) {
		this.startDevServer(projectRoot, config);
	}

	/**
	 * Start the development server
	 * @param projectRoot Project root
	 * @param config App config
	 */
	private startDevServer(projectRoot: string, config: AppConfig) {
		const joinToRoot = (pathName: string) => {
			return path.join(projectRoot, pathName);
		};

		const excludedDirs = [
			joinToRoot("./.nitrojs"),
			joinToRoot("./node_modules"),
			joinToRoot(".git"),
			joinToRoot(".vscode"),
			joinToRoot(".vs"),
			joinToRoot(".idea"),
			joinToRoot(".atom"),
			joinToRoot("nitrojs.config.js"),
			joinToRoot("nitrojs.config.ts"),
			joinToRoot("package-lock.json"),
			joinToRoot("yarn.lock"),
		] as string[];

		const dirNotExcluded = (dirPath: string): boolean => {
			let result = true;

			excludedDirs.forEach((excluded) => {
				if (path.join(dirPath).startsWith(path.join(excluded))) {
					result = false;
				}
			});

			return result;
		};

		let currentScriptProcess: ReturnType<typeof ScriptVirtualMachine.runProcessScript>;
		let projectPackage: any = {};
		let finalMainPath = "";

		process.stdin.resume();
		process.stdin.setRawMode(true);
		readline.emitKeypressEvents(process.stdin);

		process.stdin.on("keypress", (value, key) => {
			if (key.ctrl && key.name == "c") {
				process.exit(0);
			}

			currentScriptProcess.stdin?.write(key.sequence);
		});

		const bootEntry = () => {
			currentScriptProcess = ScriptVirtualMachine.runProcessScript(
				projectRoot,
				path.join(projectRoot, ".nitrojs/compiled", path.relative(projectRoot, finalMainPath)),
				config.node.program.args
			);

			currentScriptProcess.stdout?.pipe(process.stdout);
			currentScriptProcess.stderr?.pipe(process.stderr);
		};

		const killEntry = () => {
			currentScriptProcess.kill();
		};

		const recursiveCompileDir = (dir = "./") => {
			const dirContents = fs.readdirSync(dir);

			try {
				dirContents.forEach((dirItem) => {
					if (dirNotExcluded(path.join(projectRoot, dir, dirItem))) {
						if (
							fs.lstatSync(path.join(projectRoot, dir, dirItem)).isDirectory() &&
							dirNotExcluded(path.join(projectRoot, dir, dirItem))
						) {
							recursiveCompileDir(path.join(dir, dirItem));
							return;
						}

						try {
							Terminal.log(
								`New file compiled from "${path.relative(projectRoot, path.join(dir, dirItem))}"`
							);

							let compiledCode: string;

							if (dirItem.endsWith(".ts")) {
								compiledCode = this.compileTSC(path.join(projectRoot, dir, dirItem)) ?? "";
							} else {
								compiledCode = fs.readFileSync(path.join(projectRoot, dir, dirItem)).toString();
							}

							let finalDirItem = dirItem;
							if (dirItem.endsWith(".ts")) {
								finalDirItem = finalDirItem.slice(0, -2) + "js";
							}

							CacheStore.writeStore(
								path.join("compiled", path.relative(projectRoot, path.join(dir, finalDirItem))),
								compiledCode
							);
						} catch {}
					}
				});
			} catch {}
		};

		try {
			projectPackage = JSON.parse(
				fs.readFileSync(path.join(projectRoot, "package.json")).toString()
			);
		} catch (error) {
			Binary.renderErrorException(error);
			process.exit(0);
		}

		if (typeof projectPackage.main != "string") {
			Binary.renderErrorException(
				new Error(
					"Failed to load main script because the main property in the package file does not exist or is not a string"
				)
			);

			process.exit(0);
		}

		if (fs.existsSync(path.join(projectRoot, projectPackage.main))) {
			finalMainPath = path.join(projectRoot, projectPackage.main);
		} else if (fs.existsSync(path.join(projectRoot, projectPackage.main))) {
			finalMainPath = path.join(projectRoot, projectPackage.main);
		} else if (fs.existsSync(path.join(projectRoot, projectPackage.main) + ".ts")) {
			finalMainPath = path.join(projectRoot, projectPackage.main) + ".js";
		} else if (fs.existsSync(path.join(projectRoot, projectPackage.main) + ".js")) {
			finalMainPath = path.join(projectRoot, projectPackage.main) + ".js";
		} else {
			Binary.renderErrorException(
				new Error(
					"The main file provided in the package file could not be found with the .js or .ts extensions"
				)
			);
			process.exit(0);
		}

		recursiveCompileDir();

		new Promise(() => {
			bootEntry();
		});

		this.fileWatcher = chokidar.watch(projectRoot, {
			ignoreInitial: true,
			ignored: excludedDirs,
		});

		this.fileWatcher.on("all", (eventType, filePath, stats) => {
			try {
				killEntry();

				if (eventType == "add" || eventType == "change") {
					let compiledCode: string;

					if (filePath.endsWith(".ts")) {
						compiledCode = this.compileTSC(filePath) ?? "";
					} else {
						compiledCode = fs.readFileSync(filePath).toString();
					}

					let finalFilePath = filePath;
					if (finalFilePath.endsWith(".ts")) {
						finalFilePath = finalFilePath.slice(0, -2) + "js";
					}

					CacheStore.writeStore(
						path.join("compiled", path.relative(projectRoot, finalFilePath)),
						compiledCode
					);

					Terminal.log(`New file compiled from "${path.relative("./", filePath)}"`);
				} else if (eventType == "unlink") {
					CacheStore.deleteStore(path.join("compiled", path.relative(projectRoot, filePath)));
				} else if (eventType == "addDir") {
					CacheStore.writeStoreDir(path.join("compiled", path.relative(projectRoot, filePath)));
				}

				bootEntry();
			} catch (error) {
				Binary.renderErrorException(error);
			}
		});
	}

	/**
	 * Compile typescript code from a file path
	 * @param filePath The path to the file
	 * @returns The compiled typescript code
	 */
	private compileTSC(filePath: string): string | undefined {
		try {
			return typeScript.transpileModule(fs.readFileSync(filePath).toString(), {
				compilerOptions: {
					module: typeScript.ModuleKind.ESNext,
					target: typeScript.ScriptTarget.ESNext,
				},
			}).outputText;
		} catch {
			return;
		}
	}
}
