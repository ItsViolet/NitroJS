import childProcess, { ChildProcess } from "child_process";
import kill from "tree-kill"; // TODO: UNINSTALL

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
		this.machine = childProcess.spawn(
			"node",
			[
				"--no-warnings",
				"--experimental-specifier-resolution=node",
				filePathRelative,
				...programArguments,
			],
			{
				cwd,
			}
		);

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
