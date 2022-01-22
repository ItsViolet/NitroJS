import chalk from "chalk";
import cliCursor from "cli-cursor";
import Terminal from "../Terminal";
import KeyPressMeta from "./KeyPressMeta";
import TerminalPrompt from "./TerminalPrompt";

/**
 * Class containing methods for creating string prompts
 */
export default class TerminalPromptString {
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
	 * The default answer
	 */
	private static defaultAnswer = "";

	/**
	 * If the prompt is done
	 */
	private static done = false;

	/**
	 * If the fake cursor is visible
	 */
	private static cursorVisibility = false;

	/**
	 * If is running
	 */
	private static _isRunning = false;

	/**
	 * Ask a string based question
	 * @param question The question to ask
	 * @param callback The answer callback
	 * @param defaultAnswer The default answer
	 */
	public static prompt(
		question: string,
		callback: (answer: string) => void,
		defaultAnswer = "",
		validator: (answer: string) => string | Promise<void> | void = () => {}
	) {
		this.question = question;
		this.renderedLines = null;
		this.currentValue = "";
		this.defaultAnswer = defaultAnswer;
		this.done = false;
		this.cursorVisibility = false;
		let useCursorLoop = true;

		const cursorLoopCallback = () => {
			if (this.cursorVisibility) this.cursorVisibility = false;
			else this.cursorVisibility = true;

			if (!this.done && useCursorLoop) this.renderLines();
		};

		let cursorLoop = setInterval(cursorLoopCallback, 800);

		cliCursor.hide();
		this.renderLines();

		const keyListener = (value: string | undefined, key: KeyPressMeta) => {
			if (key.name == "c" && key.ctrl) {
				process.exit(0);
			}

			if (key.name == "backspace") {
				this.currentValue = this.currentValue.slice(0, -1);
			} else if (key.name == "return") {
				const stopAppButNoSuccess = () => {
					TerminalPrompt.removeKeyListeners();

					this._isRunning = false;
					this.done = true;

					clearInterval(cursorLoop);
				}

				const allowContinue = () => {
					stopAppButNoSuccess();
					this.renderLines();
					callback((this.currentValue.length > 0 ? this.currentValue : this.defaultAnswer) + "");
				};

				const validated = validator(this.currentValue);

				if (typeof validated == "string" && validated.length > 0) {
					stopAppButNoSuccess();
					console.log(`${chalk.hex("#FF5555")(">")} ${validated}`);
					this.prompt(question, callback, defaultAnswer, validator);
					
					return;
				}

				if (validated instanceof Promise) {
					validated
						.then(() => {
							allowContinue();
						})
						.catch((error) => {
							stopAppButNoSuccess();
							console.log(`${chalk.hex("#FF5555")(">")} ${error}`);
							this.prompt(question, callback, defaultAnswer, validator);
						});
					return;
				}

				allowContinue();
			} else {
				this.currentValue += value;
			}

			if (!this.done) this.renderLines();
		};

		TerminalPrompt.addKeyListener(keyListener);
	}

	/**
	 * Render all the lines
	 */
	private static renderLines() {
		const render = () => {
			this.renderedLines = TerminalPrompt.renderLines(
				`${this.done ? chalk.hex("#999999")("✓") : chalk.hex("#999999")("?")} ${this.question}${
					this.defaultAnswer ? chalk.hex("#999999")(" [ " + this.defaultAnswer + " ]") : ""
				}: ${this.currentValue}${this.cursorVisibility ? "|" : ""}`
			);
		};

		if (!this.renderedLines) {
			render();
			return;
		}

		TerminalPrompt.clearLinesFrom(-this.renderedLines);
		render();
	}

	/**
	 * If is running
	 */
	public static get isRunning() {
		return this._isRunning;
	}
}
