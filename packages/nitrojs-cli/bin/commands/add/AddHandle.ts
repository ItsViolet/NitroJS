import { TerminalAnimation } from "@skylixgh/nitrojs-terminal";
import { program } from "commander";

/**
 * Command handler for the add command
 */
export default class AddHandle {
	/**
	 * Add command entry
	 */
	public constructor() {
		program.command("add <frameworkComponent>").action((frameworkComponent) => {
			enum ProcessAnimationValues {
				internet,
				componentExists,
			}

			TerminalAnimation.start([
				{
					label: "Checking internet connection",
					name: ProcessAnimationValues.internet,
				},
				{
					label: `Checking is "@skylixgh/nitrojs-${frameworkComponent}" exists`,
					name: ProcessAnimationValues.componentExists,
				},
			]);
		});
	}
}
