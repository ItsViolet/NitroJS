import Terminal from "@skylixgh/nitrojs-terminal";
import childProcess, { ChildProcess } from "child_process";
import path from "path";

/**
 * The NitroJS virtual machine for executing scripts
 */
export default class ScriptVirtualMachine {
	/**
	 * The virtual process for the script
	 */
	private static machine: ChildProcess;

	/**
	 * Execute a script via the NitroJS VM
	 * @param cwd Process CWD
	 * @param filePathRelative The file path to the script relative to the CWD provided
	 * @param programArguments All program arguments
	 */
	public static runProcessScript(
		cwd: string,
		filePathRelative: string,
		programArguments: string[]
	) {
		if (filePathRelative.endsWith(".ts")) filePathRelative = filePathRelative.slice(0, -2) + "js";

		this.machine = childProcess.spawn(
			"node",
			[
				"--no-warnings",
				"--experimental-specifier-resolution=node",
				path.join(".nitrojs/compiled", filePathRelative),
				...programArguments,
			],
			{
				cwd,
			}
		);

		this.machine.on("exit", (code) => {
			Terminal.notice(`The app has exited with code ${code ?? 0}`);
		});

		this.machine.stdout?.pipe(process.stdout);
		this.machine.stderr?.pipe(process.stderr);
	}

	/**
	 * Send input into the VM process
	 * @param sequence Key sequence
	 */
	public static sendVMInput(sequence: string) {
		if (this.machine.killed) return;
		this.machine.stdin?.write(sequence);
	}

	/**
	 * Kill the VM server
	 */
	public static haltVMServer() {
		this.machine?.kill();
	}
}
