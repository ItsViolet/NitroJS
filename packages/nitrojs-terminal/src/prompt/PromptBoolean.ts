import chalk from "chalk";
import readline from "readline";

/**
 * Class containing methods for creating prompts
 */
export default class PromptBoolean {
    /**
     * Stop STDIN listeners
     */
    public static stopSTDIN() {
        readline.createInterface({
            input: process.stdin,
            output: process.stdout
        }).close();
    }

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

		function calculateWrappedLineCount(width: number, rawData: string): number {
			return Math.floor(rawData.length / width);
		}

		function renderOutputData() {
			const output = `> ${question}: Yes / No`;
			const hexMuted = chalk.hex("#999999");
			
			if (currentState) {
				process.stdout.write(`${hexMuted(">")} ${question}: ${chalk.underline("Yes")} / ${hexMuted("No")}`);
			} else {
				process.stdout.write(`${hexMuted(">")} ${question}: ${hexMuted("Yes")} / ${chalk.underline("No")}`);
			}

			let wrappedLines = calculateWrappedLineCount(process.stdout.columns, question);
			process.stdout.moveCursor(-output.length, -(wrappedLines));
		}
		
		renderOutputData();

		const keyPressHandle = (value: any, key: any) => {
			if (key.sequence == "\x03") {
				process.stdout.write("\n");
				process.exit(0);
			}

			if (key.name == "return") {
				process.stdin.removeListener("keypress", keyPressHandle);		
				process.stdin.pause();
				this.stopSTDIN();
				
				process.stdout.write("\n");
				callback(currentState);
			}

			if (key.name == "space" || key.name == "left" || key.name == "right") {
				if (currentState) {
					currentState = false;
				} else {
					currentState = true;
				}

				renderOutputData();
			}
		};

		process.stdin.on("keypress", keyPressHandle);
		readline.emitKeypressEvents(process.stdin);
	}
}
