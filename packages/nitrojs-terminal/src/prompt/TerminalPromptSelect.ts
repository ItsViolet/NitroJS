import chalk from "chalk";
import cliCursor from "cli-cursor";
import TerminalPrompt from "./TerminalPrompt";

type AnswerType = {
	label: string;
	value: string;
};

/**
 * A select prompt
 */
export default class TerminalPromptSelect {
	/**
	 * If is running
	 */
	private static _isRunning = false;

	/**
	 * Number of lines rendered for last frame
	 */
	private static linesRendered: null | number = null;

	/**
	 * Current value
	 */
	private static currentValue = "";

	/**
	 * All answers
	 */
	private static answers: AnswerType[] = [];

	/**
	 * The question
	 */
	private static question = "";

	/**
	 * If is done
	 */
	private static done = false;

	/**
	 * Ask a select box
	 * @param question The question
	 * @param answers All the possible selectable answers
	 * @param callback The answer callback
	 * @param defaultAnswer The default value
	 */
	public static prompt(
		question: string,
		answers: [ AnswerType, ...AnswerType[] ],
		callback: (answer: string) => void,
		defaultAnswer = answers[0].value
	) {
		this.currentValue = defaultAnswer;
		this.linesRendered = null;
		this.answers = answers;
		this.question = question;
		this.done = false;

		this.renderLines();
		let currentIndex = 0;

		cliCursor.hide();

		TerminalPrompt.addKeyListener((value, key) => {
			if (key.name == "c" && key.ctrl) {
				process.exit();
			}

			if (key.name == "return") {
				this.done = true;
				TerminalPrompt.removeKeyListeners();
				
				cliCursor.show();
				callback(this.currentValue);
			} else if (key.name == "up") {
				currentIndex--;

				if (currentIndex < 0) {
					currentIndex = this.answers.length - 1;
				}

				this.currentValue = this.answers[currentIndex].value;
			} else if (key.name == "down") {
				currentIndex++;
				if (!this.answers[currentIndex]) {
					currentIndex = 0;
				}

				this.currentValue = this.answers[currentIndex].value;
			}

			this.renderLines();
		});
	}

	/**
	 * Render all lines
	 */
	private static renderLines() {
		const chalkGray = chalk.hex("#999999");

		const render = () => {
			const optionsWithSelected = [] as string[];

			this.answers.forEach(answer => {
				if (answer.value == this.currentValue) {
					optionsWithSelected.push(
						`> ${answer.label}`
					);

					return;
				}

				optionsWithSelected.push(
					`  ${chalkGray(answer.label)}`
				);
			});

			this.linesRendered = TerminalPrompt.renderLines([
				`${chalkGray(">")} ${this.question}:`,
				...optionsWithSelected
			]);
		};

		if (!this.linesRendered) {
			render();
			return;
		}

		TerminalPrompt.clearLinesFrom(-this.linesRendered);
		render();
	}

	/**
	 * If is running
	 */
	public static get isRunning() {
		return this._isRunning;
	}
}
