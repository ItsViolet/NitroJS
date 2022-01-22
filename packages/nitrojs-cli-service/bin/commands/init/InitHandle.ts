import {
	TerminalPromptBoolean,
	TerminalPromptSelect,
	TerminalPromptString,
} from "@skylixgh/nitrojs-terminal/src/Terminal";
import CommandOptions from "./CommandOptions";
import InitAnswers from "./interfaces/InitAnswers";
import semver from "semver";
import AppConfigType from "../../interfaces/AppConfigType";

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
			TerminalPromptBoolean.prompt(
				"Use TypeScript?",
				(useTS) => {
					result.typeScript = useTS;

					let value: "NodeJS" | "Desktop" | "Mobile" | "Web";
					TerminalPromptSelect.prompt(
						"What type of application are you building",
						[
							{
								label: (value = "NodeJS"),
								value: value,
							},
							{
								label: (value = "Desktop"),
								value: value,
							},
							{
								label: (value = "Mobile"),
								value: value,
							},
							{
								label: (value = "Web"),
								value: value,
							},
						],
						(appType) => {
							switch (appType as typeof value) {
								case "NodeJS":
									result.type = AppConfigType.node;
									break;

								case "Desktop":
									result.type = AppConfigType.desktop;
									break;

								case "Mobile":
									result.type = AppConfigType.mobile;
									break;

								case "Web":
									result.type = AppConfigType.web;
									break;
							}

							callback(result);
						}
					);
				},
				true
			);
		};

		const askProjectInfo = () => {
			TerminalPromptString.prompt(
				"Project name",
				(name) => {
					result.project.name = name;
					// TODO: Validator handle

					TerminalPromptString.prompt("Project description", (desc) => {
						result.project.description = desc;

						TerminalPromptString.prompt(
							"Project version",
							(version) => {
								result.project.version = version;

								TerminalPromptString.prompt("Project author", (author) => {
									result.project.author = author;

									TerminalPromptString.prompt("Project keywords", (keywords) => {
										result.project.keywords = keywords.split(" ");
										askOtherInfo();
									});
								});
							},
							"1.0.0",
							(answer) => {
								if (!semver.valid(answer)) {
									return "The version provided is not in a valid format, please visit https://semver.org for a proper version formatting guide";
								}
							}
						);
					});
				},
				"unnamed"
			);
		};

		askProjectInfo();
	}
}
