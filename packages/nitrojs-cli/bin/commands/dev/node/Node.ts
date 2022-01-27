import AppConfig from "../../../interfaces/AppConfig";
import CommandFlags from "../CommandFlags";
import chokidar from "chokidar";
import path from "path";
import readline from "readline";
import { TerminalAnimation } from "@skylixgh/nitrojs-terminal";

/**
 * Class for handling NodeJS based dev server applications
 */
export default class Node {
	/**
	 * Start a NodeJS dev server
	 * @param options CLI options
	 * @param projectRoot Project root
	 * @param appConfig App config
	 */
	public constructor(options: CommandFlags, projectRoot: string, appConfig: AppConfig) {
		const projectWatcher = chokidar.watch(projectRoot, { ignoreInitial: true });
		const excludedDirs = [".nitrojs", "node_modules", ".vscode", ".vs", ".idea", "package-lock.json"];

		excludedDirs.push(...appConfig.node.excludes);

		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
		process.stdin.resume();

		process.stdin.on("keypress", (value, key) => {
			if (key.ctrl && key.name == "c") {
				process.exit(0);
			}
		});

		this.startDevServer();

		projectWatcher.on("all", (eventType, filePath, stats) => {
			if (!this.checkIfExcluded(excludedDirs, projectRoot, filePath)) {
				console.log(filePath);
			}
		});
	}

	private checkIfExcluded(excluded: string[], projectRoot: string, eventFile: string) {
		let result = false;

		excluded.forEach(excludedDir => {
			const excludedDirProjectRoot = path.join(projectRoot, excludedDir);

			if (path.join(eventFile).startsWith(excludedDirProjectRoot)) {
				result = true;
			}
		}); 

		return result;
	}

	private startDevServer() {}
}
