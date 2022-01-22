import { TerminalPromptString } from "@skylixgh/nitrojs-terminal/src/Terminal";
import CommandOptions from "./CommandOptions";
import InitAnswers from "./interfaces/InitAnswers";
import semver from "semver";

/**
 * Init command handler
 */
export default class InitHandle {
	/**
	 * Init command register
	 */
	public constructor() {
		this.askAllInfo((projectAnswers) => {
			console.log(projectAnswers);
		});
	}

	/**
	 * Ask all the init info
	 * @param callback Callback for when answers are done
	 */
	private askAllInfo(callback: (answers: InitAnswers) => void) {
		const result = { project: {} } as InitAnswers;

		const askOtherInfo = () => {
			callback(result);
		};

		const askProjectInfo = () => {
			TerminalPromptString.prompt(
				"Project name",
				(name) => {
					result.project.name = name;
					// TODO: Validator handle

					TerminalPromptString.prompt("Project description", (desc) => {
						result.project.description = desc;

						TerminalPromptString.prompt("Project version", (version) => {
							if (!semver.valid(version)) {
								return "The version provided is not in a valid format, please visit https://semver.org for a proper version formatting guide";
							}

							result.project.version = version;

							TerminalPromptString.prompt("Project author", (author) => {
								result.project.author = author;

								TerminalPromptString.prompt("Project keywords", (keywords) => {
									result.project.keywords = keywords.split(" ");
									askOtherInfo();
								});
							});
						});
					});
				},
				"unnamed",
				(answer) => {
					if (answer == "uwu") {
						return "NO uwu allowed lol";
					}
				}
			);
		};

		askProjectInfo();
	}
}
