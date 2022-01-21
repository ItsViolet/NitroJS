import chalk from "chalk";
import TerminalPrompt from "./TerminalPrompt";

/**
 * Class containing methods for creating boolean prompts
 */
export default class PromptBoolean {
	/**
	 * The prompt question
	 */
	private static question = "";

	/**
	 * The current value
	 */
	private static currentValue = false;

	/**
	 * If the response is done
	 */
	private static done = false;

	/**
	 * The amount of lines last rendered
	 */
	private static linesRendered: number | null = null;

	/**
	 * If the prompt was forcefully halted
	 */
	private static halted = false;

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
		this.question = question;
		this.currentValue = defaultValue;
		this.linesRendered = null;
		this.done = false;
		this.renderLines();
		
		TerminalPrompt.addKeyListener((value, key) => {
			if (key.name == "c" && key.ctrl) {
				this.halted = true;

				this.renderLines();
				process.exit(0);
			}

			switch (value) {
				case "1":
					this.leftArrow();
					break;

				case "0":
					this.rightArrow();
					break;
			}

			switch (key.name) {
				case "right":
					this.rightArrow();
					break;

				case "left":
					this.leftArrow();
					break;
				
				case "return":
					this.done = true;
					break;
			}

			this.renderLines();
			
			if (this.done) {
				TerminalPrompt.removeKeyListeners();
				callback(this.currentValue);
			}
		});
	}

	/**
	 * Get the number of lines a string will wrap to
	 * @param width The max width
	 * @param rawData The raw text as one line
	 * @returns The number of lines this will wrap to
	 * ! Is this still really
	 * ! Needed for the supp-
	 * ! ort of the framework?
	 */
	private static calculateWrappedLineCount(width: number, rawData: string) {
		return Math.floor(rawData.length / width);
	}

	/**
	 * Render all lines based off of current state
	 * @param clear If the output should be cleared first
	 */
	private static renderLines(clear = true) {
		const chalkGray = chalk.hex("#999999");

		const render = () => {
			let yesNoArea: string;
			const chalkGray = chalk.hex("#999999");
			
			if (this.done) {
				yesNoArea = this.currentValue ? "Yes" : "No";
			} else {
				if (this.currentValue) {
					yesNoArea = `${chalk.underline("Yes")} / ${chalkGray("No")}`;
				} else {
					yesNoArea = `${chalkGray("Yes")} / ${chalk.underline("No")}`;
				}
			}

			this.linesRendered = TerminalPrompt.renderLines(
				`${this.halted ? chalk.hex("#FF5555")(">") : this.done ? chalkGray("✓") : chalkGray(">")} ${
					this.question
				}: ${yesNoArea}`
			);
		};

		if (!this.linesRendered) {
			render();
			return;
		}

		TerminalPrompt.clearLinesFrom(-this.linesRendered);
		render();
	}

	/**
	 * Handle state for right arrow
	 */
	private static rightArrow() {
		this.currentValue = false;
	}

	/**
	 * Handle state for left arrow
	 */
	private static leftArrow() {
		this.currentValue = true;
	}
}
