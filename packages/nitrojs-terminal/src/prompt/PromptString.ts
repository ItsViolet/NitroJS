import chalk from "chalk";
import TerminalPrompt from "./TerminalPrompt";

/**
 * Class containing methods for creating string prompts
 */
export default class PromptString {
	/**
	 * The number of lines rendered
	 */
	private static renderedLines: null | number = null;

	/**
	 * The current string value
	 */
	private static currentValue = "";

	/**
	 * Current question
	 */
	private static question = "";

	/**
	 * Ask a string based question
	 * @param question The question to ask
	 * @param callback The answer callback
	 * @param defaultAnswer The default answer
	 */
	public static handleStringInput(
		question: string,
		callback: (answer: string) => void | string,
		defaultAnswer: string
	) {
        this.question = question;
        this.renderedLines = null;

        this.renderLines();

		TerminalPrompt.addKeyListener((value, key) => {
			if (key.name == "c" && key.ctrl) {
				process.exit(0);
			}

			if (key.name == "backspace") {
				this.currentValue = this.currentValue.slice(0, -1);
			} else if (key.name == "return") {
				
			} else {
				this.currentValue += value;
			}

			this.renderLines();
		});
	}

	/**
	 * Render all the lines
	 */
	private static renderLines() {
		const render = () => {
			this.renderedLines = TerminalPrompt.renderLines(
				`${chalk.hex("#999999")(">")} ${this.question}: ${this.currentValue}|`
			);
		};

		if (!this.renderedLines) {
			render();
			return;
		}

		TerminalPrompt.clearLinesFrom(-(this.renderedLines));
		render();
	}
}