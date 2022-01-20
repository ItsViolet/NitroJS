import chalk from "chalk";
import readline from "readline";

/**
 * Class containing methods for creating prompts
 */
export default class PromptBoolean {
	/**
	 * The boolean type prompt handler
	 * @param question The question to ask
	 * @param callback The answer callback
	 * @param defaultValue The default value
	 */
	public static handleBooleanInput(
		question: string,
		callback: (answer: boolean) => void,
		defaultValue: boolean
	) {
		process.stdin.resume();
		process.stdin.setRawMode(true);
		let currentState = defaultValue;

		function renderOutputData() {
			const output = `> ${question}: Yes / No`;
			const hexMuted = chalk.hex("#999999");

			if (currentState) {
				process.stdout.write(
					`${hexMuted(">")} ${question}: ${chalk.underline("Yes")} / ${hexMuted("No")}`
				);
			} else {
				process.stdout.write(
					`${hexMuted(">")} ${question}: ${hexMuted("Yes")} / ${chalk.underline("No")}`
				);
			}

			let wrappedLines = PromptBoolean.calculateWrappedLineCount(process.stdout.columns, question);
			process.stdout.moveCursor(-output.length, -wrappedLines);
		}

		renderOutputData();

		function resizeListener() {
			renderOutputData();
		}

		const keyPressHandle = (value: any, key: any) => {
			if (key.sequence == "\x03") {
				process.stdout.write("\n");
				process.exit(0);
			}

			if (key.name == "return") {
				process.stdin.removeListener("keypress", keyPressHandle);
				process.stdout.removeListener("resize", resizeListener);

				process.stdin.pause();
				process.stdin.end();

				process.stdout.write("\n");
				process.stdout.clearLine(1);
				callback(currentState);
			}

			if (key.name == "space") {
				if (currentState) {
					currentState = false;
				} else {
					currentState = true;
				}
			} else if (key.name == "left") {
				currentState = true;
			} else if (key.name == "right") {
				currentState = false;
			}

			renderOutputData();
		};

		process.stdin.on("keypress", keyPressHandle);
		process.stdout.on("resize", resizeListener);

		readline.emitKeypressEvents(process.stdin);
	}

	/**
	 * Get the number of lines a string will wrap to
	 * @param width The max width
	 * @param rawData The raw text as one line
	 * @returns The number of lines this will wrap to
	 */
	public static calculateWrappedLineCount(width: number, rawData: string) {
		return Math.floor(rawData.length / width);
	}
}
