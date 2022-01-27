import Terminal from "@skylixgh/nitrojs-terminal";
import childProcess, { ChildProcess } from "child_process";
import path from "path";
import kill from "tree-kill"; // TODO: Uninstall
import CacheStore from "../../../utils/cacheStore/CacheStore";

/**
 * The NitroJS virtual machine for executing scripts
 */
export default class ScriptVirtualMachine {
	/**
	 * The virtual process for the script
	 */
	private static machine?: ChildProcess;

	/**
	 * Execute a script via the NitroJS VM
	 * @param cwd Process CWD
	 * @param filePathRelative The file path to the script relative to the CWD provided
	 * @param programArguments All program arguments
	 * @param finished When the app is done
	 */
	public static runProcessScript(
		cwd: string,
		filePathRelative: string,
		programArguments: string[],
		finished: () => void
	) {
		if (filePathRelative.endsWith(".ts")) filePathRelative = filePathRelative.slice(0, -2) + "js";

		this.machine = childProcess.fork(
			path.join(CacheStore.location, "compiled", filePathRelative),
			programArguments,
			{
				stdio: "inherit",
				cwd,
				env: {
					FORCE_COLOR: true
				} as any,
			}
		);

		this.machine.on("exit", (code) => {
			Terminal.notice(`The app has exited with code ${code ?? 0}`);
			finished();
		});
	}

	/**
	 * Send input into the VM process
	 * @param sequence Key sequence
	 */
	public static sendVMInput(sequence: string) {
		if (this.machine?.killed) return;
		this.machine?.stdin?.write(sequence);
	}

	/**
	 * Kill the VM server
	 */
	public static haltVMServer() {
		this.machine?.kill();
		this.machine?.kill("SIGINT");
		this.machine?.kill("SIGTERM");
		this.machine?.kill("SIGABRT");
		
		this.machine = undefined;
	}
}
