import AppConfig from "../../../interfaces/AppConfig";
import CommandFlags from "../CommandFlags";
import chokidar from "chokidar";
import path from "path";
import typeScript from "typescript";
import Terminal, {
	KeyPressMeta,
	TerminalAnimation,
	TerminalAnimationState,
} from "@skylixgh/nitrojs-terminal";
import fs from "fs-extra";
import DevServerAnimationNames from "../DevServerAnimationNames";
import CacheStore from "../../../utils/cacheStore/CacheStore";
import { Binary } from "../../../Binary";
import ScriptVirtualMachine from "./ScriptVirtualMachine";

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

		let appPackage = {} as any;

		if (!fs.existsSync(path.join(projectRoot, "package.json"))) {
			Terminal.error("The package file does not exist");
			process.exit(0);
		}

		let appPackageRaw = fs.readFileSync(path.join(projectRoot, "package.json"));
		appPackage = JSON.parse(appPackageRaw.toString());

		if (typeof appPackage.main != "string") {
			Terminal.error("The main entry in the package file does not exist or is not a string");
			process.exit(0);
		}

		let finalMainLocation = "";

		if (fs.existsSync(appPackage.main) && appPackage.main.endsWith(".ts")) {
			finalMainLocation = path.join(projectRoot, appPackage.main);
		} else if (fs.existsSync(appPackage.main) && appPackage.main.endsWith(".js")) {
			finalMainLocation = path.join(projectRoot, appPackage.main);
		} else if (fs.existsSync(appPackage.main + ".ts")) {
			finalMainLocation = path.join(projectRoot, appPackage.main + ".ts");
		} else if (fs.existsSync(appPackage.main + ".js")) {
			finalMainLocation = path.join(projectRoot, appPackage.main + ".js");
		} else {
			Terminal.error("Failed to locate the main entry script defined in the package file with JS or TS extensions");
			process.exit(0);
		}

		appPackage.main = finalMainLocation;

		projectWatcher.on("all", (eventType, filePath, stats) => {
			startCompiling(filePath);
			this.storeCacheRecord(projectRoot, filePath, appConfig, appPackage);
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

	private storeCacheRecord(
		projectRoot: string,
		eventFile: string,
		appConfig: AppConfig,
		appPackage: any
	) {
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

			this.runDevServer(projectRoot, appConfig.node.program.args, appPackage);
		} catch (error) {
			Binary.renderErrorException(error);
			this.setupKeyPressListener();
		}
	}

	/**
	 * Start the development server with VM
	 * @param projectRoot Project root dir
	 * @param programArgs Program execution args
	 * @param appPackage The application package file
	 */
	private runDevServer(projectRoot: string, programArgs: string[], appPackage: any) {
		ScriptVirtualMachine.haltVMServer();
		Terminal.log("The app will now execute");
		
		ScriptVirtualMachine.runProcessScript(
			projectRoot,
			path.relative(projectRoot, appPackage.main),
			programArgs
		);
	}
}
