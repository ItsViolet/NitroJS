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
						type: TerminalPromptType.string,
						defaultAnswer: "unnamed-project"
					},
					{
						question: "Project description",
						name: "description",
						type: TerminalPromptType.string
					},
					{
						question: "Project version",
						name: "version",
						type: TerminalPromptType.string,
						defaultAnswer: "1.0.0"
					},
					{
						question: "Integrate TypeScript support",
						name: "useTypeScript",
						type: TerminalPromptType.string,
						defaultAnswer: true
					},
					{
						question: "Use demo application otherwise blank project",
						name: "demo",
						type: TerminalPromptType.boolean,
						defaultAnswer: true
					}
				], (answers) => {
					console.log(answers);
				});
			});
	}
}
