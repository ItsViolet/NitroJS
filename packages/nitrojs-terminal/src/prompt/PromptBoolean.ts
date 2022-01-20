import chalk from "chalk";
import readline from "readline";
import TerminalPrompt from "./TerminalPrompt";

/**
 * Class containing methods for creating prompts
 */
export default class PromptBoolean {
	/**
	 * The prompt question
	 */
	private static question = "";

	/**
	 * The answer callback
	 */
	private static callback: (answer: boolean) => void;

	/**
	 * The current value
	 */
	private static currentValue = false;

	/**
	 * The amount of lines last rendered
	 */
	private static linesRendered: number | null = null;

	/**
	 * If the prompt was forcefully halted
	 */
	private static halted = false;

	/**
	 * If the flashing arrow is in its on or off frame
	 */
	private static flashState = false;

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
		this.callback = callback;
		this.currentValue = defaultValue;

		this.renderLines();
		setInterval(() => {
			if (this.flashState) {
				this.flashState = false;
			} else {
				this.flashState = true;
			}

			this.renderLines();
		}, 500);

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
			}

			this.renderLines();
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
	 */
	private static renderLines() {
		const chalkGray = chalk.hex("#999999");

		const render = () => {
			this.linesRendered = TerminalPrompt.renderLines(
				`${this.halted ? chalk.hex("#FF5555")(">") : this.flashState ? ">" : chalkGray(">")} ${
					this.question
				}: ${
					this.currentValue
						? `${chalk.underline("Yes")} / ${chalkGray("No")}`
						: `${chalkGray("Yes")} / ${chalk.underline("No")}`
				}`
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

/**
 * OLD CODE
 * @author XFaonAE
 * @author MelonFruit7
 */
// process.stdin.resume();
// process.stdin.setRawMode(true);
// let currentState = defaultValue;

// function renderOutputData() {
// 	const output = `> ${question}: Yes / No`;
// 	const hexMuted = chalk.hex("#999999");

// 	if (currentState) {
// 		process.stdout.write(
// 			`${hexMuted(">")} ${question}: ${chalk.underline("Yes")} / ${hexMuted("No")}`
// 		);
// 	} else {
// 		process.stdout.write(
// 			`${hexMuted(">")} ${question}: ${hexMuted("Yes")} / ${chalk.underline("No")}`
// 		);
// 	}

// 	let wrappedLines = PromptBoolean.calculateWrappedLineCount(process.stdout.columns, question);
// 	process.stdout.moveCursor(-output.length, -wrappedLines);
// }

// renderOutputData();

// function resizeListener() {
// 	renderOutputData();
// }

// const keyPressHandle = (value: any, key: any) => {
// 	if (key.sequence == "\x03") {
// 		process.stdout.write("\n");
// 		process.exit(0);
// 	}

// 	if (key.name == "return") {
// 		process.stdin.removeListener("keypress", keyPressHandle);
// 		process.stdout.removeListener("resize", resizeListener);

// 		process.stdin.pause();
// 		process.stdin.end();

// 		process.stdout.write("\n");
// 		process.stdout.clearLine(1);
// 		callback(currentState);
// 	}

// 	if (key.name == "space") {
// 		if (currentState) {
// 			currentState = false;
// 		} else {
// 			currentState = true;
// 		}
// 	} else if (key.name == "left") {
// 		currentState = true;
// 	} else if (key.name == "right") {
// 		currentState = false;
// 	}

// 	renderOutputData();
// };

// process.stdin.on("keypress", keyPressHandle);
// process.stdout.on("resize", resizeListener);

// readline.emitKeypressEvents(process.stdin);
