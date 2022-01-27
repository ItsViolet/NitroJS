import AppConfig from "../../../interfaces/AppConfig";
import CommandFlags from "../CommandFlags";
import chokidar from "chokidar";
import path from "path";
import readline from "readline";
import { KeyPressMeta, TerminalAnimation, TerminalAnimationState } from "@skylixgh/nitrojs-terminal";
import fs from "fs-extra";
import DevServerAnimationNames from "../DevServerAnimationNames";

/**
 * Class for handling NodeJS based dev server applications
 */
export default class Node {
	/**
	 * The CLI key press listener
	 */
	private keyPressListener: (value: string | undefined, key: KeyPressMeta) => void;

	/**
	 * Start a NodeJS dev server
	 * @param options CLI options
	 * @param projectRoot Project root
	 * @param appConfig App config
	 */
	public constructor(options: CommandFlags, projectRoot: string, appConfig: AppConfig) {
		const projectWatcher = chokidar.watch(projectRoot, { ignoreInitial: true });
		const excludedDirs = [
			".nitrojs",
			"node_modules",
			".vscode",
			".vs",
			".idea",
			"package-lock.json",
		];

		excludedDirs.push(...appConfig.node.excludes);

		this.keyPressListener = (value, key) => {
			if (key.ctrl && key.name == "c") {
				process.exit(0);
			}
		};

		this.setupKeyPressListener();

		this.recursivelyCopyAllFiles(projectRoot, "./", excludedDirs);

		projectWatcher.on("all", (eventType, filePath, stats) => {
			this.recursivelyCopyAllFiles(projectRoot, "./", excludedDirs, filePath);
		});
	}

	/**
	 * Setup the key press listener
	 */
	private setupKeyPressListener() {
		process.stdin.removeListener("keypress", this.keyPressListener);

		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.on("keypress", this.keyPressListener);
	}

	private recursivelyCopyAllFiles(
		projectRoot: string,
		startingPath: string,
		excludedDirs: string[],
		eventFile?: string
	) {
		if (eventFile && this.checkIfExcluded(excludedDirs, projectRoot, eventFile)) {
			return;
		}

		TerminalAnimation.start([
			{
				label: "Compiling project files, please wait",
				name: DevServerAnimationNames.nodeStartingCompiling,
			},
		]);

		const doneCompiling = () => {
			TerminalAnimation.stopAll(
				DevServerAnimationNames.nodeStartingCompiling,
				TerminalAnimationState.success,
				"Successfully compiled project files"
			);

			this.setupKeyPressListener();
		};

		this.setupKeyPressListener();

		if (eventFile) {
			doneCompiling();
			return;
		}

		fs.readdirSync(path.join(projectRoot, startingPath)).forEach((dirItemPath: string) => {
			const filePath = path.join(
				projectRoot,
				path.relative(projectRoot, path.join(startingPath, dirItemPath))
			);
			
			if (this.checkIfExcluded(excludedDirs, projectRoot, filePath)) {
				return;
			}

			console.log(filePath)

			try {
				if (fs.lstatSync(filePath).isDirectory()) {
					this.recursivelyCopyAllFiles(projectRoot, path.join(startingPath, dirItemPath), []);
					return;
				}
			} catch {
				this.setupKeyPressListener();
			}
		});
	}

	/**
	 * Check if a path is excluded
	 * @param excluded The excluded directories
	 * @param projectRoot The project's root dir
	 * @param eventFile The file path that was change, added, unlinked, etc...
	 * @returns If the directory is excluded
	 */
	private checkIfExcluded(excluded: string[], projectRoot: string, eventFile: string) {
		let result = false;

		excluded.forEach((excludedDir) => {
			const excludedDirProjectRoot = path.join(projectRoot, excludedDir);

			if (path.join(eventFile).startsWith(excludedDirProjectRoot)) {
				result = true;
			}
		});

		return result;
	}

	/**
	 * Start the development server with VM
	 */
	private startDevServer() {}
}
