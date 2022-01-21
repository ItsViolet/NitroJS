import Terminal, {
	TerminalPrompt,
	TerminalPromptType,
} from "@skylixgh/nitrojs-terminal/src/Terminal";
import { program } from "commander";

/**
 * Init command handler
 */
export default class InitHandle {
	/**
	 * Init command register
	 */
	public constructor() {
		program
			.command("init [directory]")
			.option("--name", "Name of the project", "")
			.action((directory?: string) => {
				Terminal.log("Initialize a new project");

				TerminalPrompt.promptQueue([
					{
						question: "What is your project called?",
						name: "name",
						type: TerminalPromptType.string
					},
					{
						question: "Project description",
						name: "description",
						type: TerminalPromptType.string
					}
				], (answers) => {
					console.log(answers);
				});

			// 	TerminalPrompt.prompt(TerminalPromptType.string, "Name of your project", (projectName) => {
			// 		TerminalPrompt.prompt(
			// 			TerminalPromptType.string,
			// 			"What type of project is this (Node / Web / Desktop / Mobile)",
			// 			(projectType) => {
			// 				TerminalPrompt.prompt(
			// 					TerminalPromptType.string,
			// 					"Project description",
			// 					(projectDescription) => {
			// 						TerminalPrompt.prompt(
			// 							TerminalPromptType.string,
			// 							"Project version",
			// 							(projectVersion) => {
			// 								TerminalPrompt.prompt(
			// 									TerminalPromptType.string,
			// 									"Project author",
			// 									(projectAuthor) => {
			// 										TerminalPrompt.prompt(
			// 											TerminalPromptType.boolean,
			// 											"Should this project use TypeScript",
			// 											(useTypeScript) => {
			// 												TerminalPrompt.prompt(
			// 													TerminalPromptType.boolean,
			// 													"Open with VSCode when finished",
			// 													(openWithCode) => {},
			// 													false
			// 												);
			// 											},
			// 											true
			// 										);
			// 									}
			// 								);
			// 							},
			// 							"1.0.0"
			// 						);
			// 					}
			// 				);
			// 			}
			// 		);
			// 	});
			});
	}
}
