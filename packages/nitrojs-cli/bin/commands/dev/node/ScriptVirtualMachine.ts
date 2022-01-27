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
	 * @param filePath The file path to the script
     * @param programArguments All program arguments
	 */
	public static runProcessScript(cwd: string, filePath: string, programArguments: string[]) {
		this.machine = childProcess.fork(filePath, programArguments, {
			cwd
		});
	}
}
