import readline from "readline";

/**
 * Class containing methods for creating prompts
 */
export default class PromptHandler {
    /**
     * Stop STDIN listeners
     */
    public stopSTDIN() {
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

		function renderOutputData() {
			if (currentState) {
				process.stdout.write("[YES] /  NO \r");
			} else {
				process.stdout.write(" YES  / [NO] \r");
			}
		}

		const keyPressHandle = (value: any, key: any) => {
			if (key.sequence == "\x03") {
				process.exit(0);
			}

            if (key.name == "return") {
                process.stdin.end();
                process.stdin.removeListener("keypress", keyPressHandle);
                
                this. 

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
