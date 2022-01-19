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
		process.stdin.setRawMode(true);
		let currentState = defaultValue;

		function calculateWrappedLineCount(width: number, rawData: string): number {
			let lines = 0;
			let modRaw = rawData;

			const nextLine = () => {
				if (modRaw.length != 0) {
					modRaw = modRaw.substring(width);
					lines++;

					nextLine();
				}
			}

			nextLine();
			return lines;
		}

		function renderOutputData() {
			let output = "";

			if (currentState) {
				output = `${question} [YES] /  NO  `;
				process.stdout.write(output);
			} else {
				output = `${question}  YES  / [NO] `;
				process.stdout.write(output);
			}

			let wrappedLines = calculateWrappedLineCount(process.stdout.columns, question);

			if (wrappedLines - 1 < -1) {
				wrappedLines = 2;
			}
			
			process.stdout.moveCursor(-output.length, -(wrappedLines - 1));
		}
		
		renderOutputData();

		const keyPressHandle = (value: any, key: any) => {
			if (key.sequence == "\x03") {
				process.exit(0);
			}

			if (key.name == "return") {
				process.stdin.end();
				process.stdin.removeListener("keypress", keyPressHandle);

				this.stopSTDIN();
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
