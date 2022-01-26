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
	 * Register listener for CTRL + C to exit app since that key register is gone by default
	 */
	public registerExitListener() {
		TerminalPrompt.addKeyListener((value, key) => {
			if (key.ctrl && key.name == "c") {
				process.exit(0);
			}
		});
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
								this.compileTSC(path.join(projectRoot, dir, dirItem)) ?? "";
							} else {
								compiledCode = fs.readFileSync(path.join(projectRoot, dir, dirItem)).toString();
							}

							CacheStore.writeStore(
								path.relative(projectRoot, path.join("compiled/", dir, dirItem)),
								compiledCode!
							);
						} catch {}
					}
				});
			} catch {}
		};

		recursiveCompileDir();
		
		this.fileWatcher = chokidar.watch(projectRoot, {
			ignoreInitial: true,
			ignored: excludedDirs
		});

		this.fileWatcher.on("all", (eventType, filePath, stats) => {
			try {
				let compiledCode: string;

				if (filePath.endsWith(".ts")) {
					this.compileTSC(filePath) ?? "";
				} else {
					compiledCode = fs.readFileSync(filePath).toString();
				}

				CacheStore.writeStore(
					path.join("compiled", path.relative(projectRoot, filePath)),
					compiledCode!
				);

				Terminal.log(
					`New file compiled from "${path.relative(projectRoot, filePath)}"`
				);
			} catch {}

			if (eventType == "change") {
				Terminal.log(`New file compiled from "${filePath}"`);
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
