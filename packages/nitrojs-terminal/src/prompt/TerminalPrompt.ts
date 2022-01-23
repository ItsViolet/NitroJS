import KeyPressMeta from "./KeyPressMeta";
import readline from "readline";
import stripAnsi from "strip-ansi";

/**
 * Create interactive prompts in the terminal
 */
export default class TerminalPrompt {
	/**
	 * All key press listeners
	 */
	private static currentKeyPressListeners = [] as any[];

	/**
	 * Clear all lines from and below the relative number
	 * @param lineNumberRelative The line number relative to the current cursor position
	 */
	public static clearLinesFrom(lineNumberRelative: number) {
		process.stdout.moveCursor(0, lineNumberRelative);
		process.stdout.clearScreenDown();
	}

	/**
	 * Render a group or a single line
	 * @param lines The line or lines as an array
	 * @returns Number of lines rendered
	 */
	public static renderLines(lines: string | string[]) {
		const linesArray = [];
		let linesRendered = 0;

		if (Array.isArray(lines)) {
			linesArray.push(...lines);
		} else {
			linesArray.push(lines);
		}
 
		linesArray.forEach((line) => {
			process.stdout.write(line + "\n");
			let extraWrapLines = 0;

			const mathResult = Math.ceil(stripAnsi(line).length / process.stdout.columns);
			if (mathResult - 1 >= 1) {
				extraWrapLines = mathResult - 1;
			}

			linesRendered += 1 + extraWrapLines;
		});

		return linesRendered;
	}

	/**
	 * Add a key press listener to the STDIO
	 * @param callback The event listener
	 */
	public static addKeyListener(callback: (value: string | undefined, key: KeyPressMeta) => void) {
		process.stdin.resume();
		process.stdin.setRawMode(true);

		readline.emitKeypressEvents(process.stdin);

		this.currentKeyPressListeners.push(callback);
		process.stdin.addListener("keypress", callback);
	}

	/**
	 * Remove all key listeners that were registered from this class
	 */
	public static removeKeyListeners() {
		this.currentKeyPressListeners.forEach((callback) => {
			process.stdin.removeListener("keypress", callback);
		});

		process.stdin.pause();
	}
}
