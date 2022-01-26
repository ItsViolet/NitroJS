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
		this.fileWatcher = chokidar.watch(projectRoot, {
			ignoreInitial: true,
		});

		const excludedDirs = [
			"./.nitrojs",
			"./node_modules",
			".git",
			".vscode",
			".vs",
			".idea",
			".atom",
			"nitrojs.config.js",
			"nitrojs.config.ts"
		] as string[];

		excludedDirs.forEach((excluded, index) => {
			excludedDirs[index] = path.join(projectRoot, excluded);
		});

		const dirNotExcluded = (dirPath: string): boolean => {
			return !excludedDirs.includes(dirPath);
		};

		const recursiveCompileDir = (dir = projectRoot) => {
			const dirContents = fs.readdirSync(dir);

			try {
				dirContents.forEach((dirItem) => {
					if (dirNotExcluded(path.join(dir, dirItem))) {
						if (fs.lstatSync(path.join(dir, dirItem)).isDirectory() && dirNotExcluded(dirItem)) {
							recursiveCompileDir(dirItem);
							return;
						}

						Terminal.log(
							`New file compiled from "${path.relative(projectRoot, path.join(dir, dirItem))}"`
						);

						try {
							CacheStore.writeStore(path.relative(projectRoot, "compiled/" + path.join(dir, dirItem)), "");

							// Terminal.log(
							// 	`New file compiled from "${path.relative(projectRoot, path.join(dir, dirItem))}"`
							// );
						} catch {}
					}
				});
			} catch (error) {
				console.log(error);
			}
		};

		recursiveCompileDir();

		const isDirEvent = (eventName: string): boolean => {
			return eventName == "addDir" || eventName == "unlinkDir";
		};

		this.fileWatcher.on("all", (eventType, filePath, stats) => {
			if (isDirEvent(eventType)) return;

			if (filePath.endsWith(".ts")) {
				const typeScriptCode = this.compileTSC(filePath);
				console.log(typeScriptCode);
			} else if (filePath.endsWith(".js")) {
			}

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
