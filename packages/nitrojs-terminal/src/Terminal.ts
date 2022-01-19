import { PartialDeep } from "type-fest";
import LogCustomTagSettings from "./LogCustomTagSettings";
import chalk from "chalk";
import { DateTime } from "luxon";
import TerminalPrompt from "./prompt/TerminalPrompt";
import TerminalPromptType from "./TerminalPromptType";

export { TerminalPrompt, TerminalPromptType };

/**
 * NitroJS base terminal class
 */
export default class Terminal {
	/**
	 * If the logged data should have a time stamp
	 */
	private static useTimeStamps = false;

	/**
	 * Log an info message into the terminal
	 * @param text The text to log
	 */
	public static log(text: string) {
		this.logCustomTag(text, {
			tagPrefix: "INFO",
		});
	}

	/**
	 * Log a success message into the terminal
	 * @param text THe text to log
	 */
	public static success(text: string) {
		this.logCustomTag(text, {
			tagPrefix: "SUCCESS",
			hexColor: "#50FFAB"
		});
	}

	/**
	 * Log a warning message into the terminal
	 * @param text The text to log
	 */
	public static warn(text: string) {
		this.logCustomTag(text, {
			tagPrefix: "WARN",
			hexColor: "#FFAB00"
		});
	}

	/**
	 * Log an error message into the terminal
	 * @param text The text to log
	 */
	public static error(text: string) {
		this.logCustomTag(text, {
			tagPrefix: "ERR",
			useColorThroughout: true,
			hexColor: "#FF7777"
		});
	}

	/**
	 * Log a message into the terminal with custom parameters
	 * @param The text to log
	 * @param settings
	 */
	public static logCustomTag(text: string, settings: PartialDeep<LogCustomTagSettings>) {
		if (TerminalPrompt.isRunning) {
			return;
		}
		
		const prefixes = [] as string[];

		if (this.useTimeStamps) {
			prefixes.push(
				chalk.hex("#999999")("[ ") +
					chalk.hex("#999999")(DateTime.fromJSDate(new Date()).toFormat("hh:mm:ss a")) +
					chalk.hex("#999999")(" ]")
			);
		}

		prefixes.push(
			chalk.hex("#999999")("[ ") +
				chalk.hex(settings.hexColor ?? "#999999")(settings.tagPrefix) +
				chalk.hex("#999999")(" ]")
		);

		console.log(
			`${prefixes.join(" ")} ${
				settings.useColorThroughout ? chalk.hex(settings.hexColor ?? "#999999")(text) : text
			}`
		);
	}

	/**
	 * Set the time stamp mode
	 * @param mode The time stamps mode
	 */
	public static setTimeStampsMode(mode: boolean) {
		this.useTimeStamps = mode;
	}
}
