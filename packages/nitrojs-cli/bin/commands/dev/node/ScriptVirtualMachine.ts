import { ChildProcess, fork } from "child_process";
import path from "path";
import { dirname } from "../../../Binary";
import kill from "tree-kill"; // TODO: UNINSTALL

/**
 * The NitroJS virtual machine for executing scripts
 */
export default class ScriptVirtualMachine {
	/**
	 * Execute a script via the NitroJS VM
	 * @param cwd Process CWD
	 * @param filePath The file path to the script
     * @param programArguments All program arguments
	 */
	public static runProcessScript(cwd: string, filePath: string, programArguments: string[]): ChildProcess {
		let cps = fork(filePath, programArguments, {
			cwd
		});
		
		return cps;
	}
}
