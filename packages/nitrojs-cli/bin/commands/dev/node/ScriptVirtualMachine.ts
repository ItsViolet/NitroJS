import { ChildProcess, spawn } from "child_process";

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
		let cps = spawn("node", ["--no-warnings", "--experimental-specifier-resolution=node", filePath, ...programArguments]);
		return cps;
	}
}
