import { PartialDeep } from "type-fest";
import LogCustomTagSettings from "./LogCustomTagSettings";
import chalk from "chalk";
import luxon from "luxon";

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
			tagPrefix: "Info",
		});
	}

	/**
	 *
	 * @param text Log a message with custom parameters
	 * @param settings
	 */
	public static logCustomTag(text: string, settings: PartialDeep<LogCustomTagSettings>) {
		const prefixes = [] as string[];

		if (this.useTimeStamps) {
			prefixes.push(
				chalk.hex("#999999")("[ ") +
					chalk.hex(settings.hexColor ?? "#999999")(settings.tagPrefix ?? "") +
					chalk.hex("#999999")(" ]")
			);
		}

		prefixes.push(
			chalk.hex("#999999")("[ ") +
				chalk.hex(settings.hexColor ?? "#999999")(settings.tagPrefix) +
				chalk.hex("#999999")(" ]")
		);

		console.log(prefixes.join(" "));
	}

	/**
	 * Set the time stamp mode
	 * @param mode The time stamps mode
	 */
	public static setTimeStampsMode(mode: boolean) {
		this.useTimeStamps = mode;
	}
}
