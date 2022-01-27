import AppConfig from "../../../interfaces/AppConfig";
import CommandFlags from "../CommandFlags";
import chokidar from "chokidar";
import path from "path";
import typeScript from "typescript";
import {
	KeyPressMeta,
	TerminalAnimation,
	TerminalAnimationState,
} from "@skylixgh/nitrojs-terminal";
import fs from "fs-extra";
import DevServerAnimationNames from "../DevServerAnimationNames";
import CacheStore from "../../../utils/cacheStore/CacheStore";
import { Binary } from "../../../Binary";

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
		const relativeToRoot = (shortName: string) => path.join(projectRoot, shortName);

		let excludedDirs = [
			"./.nitrojs",
			"./node_modules",
			"./.vscode",
			"./.vs",
			"./.idea",
			"./package-lock.json",
		];

		excludedDirs.push(...appConfig.node.excludes);
		excludedDirs = excludedDirs.map(relativeToRoot);

		const projectWatcher = chokidar.watch(projectRoot, {
			ignored: excludedDirs,
		});

		this.keyPressListener = (value, key) => {
			if (key.ctrl && key.name == "c") {
				process.exit(0);
			}
		};

		this.setupKeyPressListener();

		const startCompiling = (filePath: string) => {
			if (path.relative(projectRoot, filePath).length == 0) return;

			TerminalAnimation.start([
				{
					label: `Compiling project file from "${path.relative(projectRoot, filePath)}"`,
					name: DevServerAnimationNames.nodeStartingCompiling,
				},
			]);

			this.setupKeyPressListener();
		};

		const doneCompiling = (filePath: string) => {
			if (path.relative(projectRoot, filePath).length == 0) return;

			TerminalAnimation.stopAll(
				DevServerAnimationNames.nodeStartingCompiling,
				TerminalAnimationState.success,
				`Finished compiling project file from "${path.relative(projectRoot, filePath)}"`
			);

			this.setupKeyPressListener();
		};

		projectWatcher.on("all", (eventType, filePath, stats) => {
			startCompiling(filePath);
			this.storeCacheRecord(projectRoot, filePath);
			doneCompiling(filePath);
		});
	}

	/**
	 * Setup the key press listener
	 */
	private setupKeyPressListener() {
		process.stdin.removeListener("keypress", this.keyPressListener);
		process.stdin.resume();
		process.stdin.on("keypress", this.keyPressListener);
	}

	private storeCacheRecord(projectRoot: string, eventFile: string) {
		this.setupKeyPressListener();

		try {
			if (fs.lstatSync(eventFile).isDirectory()) {
				// TODO: Something for dirs
				return;
			}

			let isTS = eventFile.endsWith(".ts");
			let cacheCode = "";

			if (isTS) {
				cacheCode = typeScript.transpileModule(fs.readFileSync(eventFile).toString(), {
					compilerOptions: {
						module: typeScript.ModuleKind.ESNext,
						target: typeScript.ScriptTarget.ESNext,
					},
				}).outputText;
			} else {
				cacheCode = fs.readFileSync(eventFile).toString();
			}

			const filePathRelative = path.relative(projectRoot, eventFile);

			if (eventFile.endsWith(".ts")) {
				CacheStore.writeStore(
					path.join("compiled", filePathRelative).slice(0, -2) + "js",
					cacheCode
				);
			} else {
				CacheStore.writeStore(path.join("compiled", filePathRelative), cacheCode);
			}
		} catch (error) {
			Binary.renderErrorException(error);
			this.setupKeyPressListener();
		}
	}

	/**
	 * Start the development server with VM
	 */
	private startDevServer() {}
}
