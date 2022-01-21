// import Terminal, { TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

import Terminal, { TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

TerminalPrompt.prompt(
	TerminalPromptType.boolean,
	"Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?Are you a programmer?",
	(dev) => {
		TerminalPrompt.prompt(TerminalPromptType.boolean, "Are you a gamer?", (gamer) => {
			TerminalPrompt.prompt(
				TerminalPromptType.boolean,
				"Are you a human?",
				(human) => {
					Terminal.log("Programmer: " + dev);
					Terminal.log("Gamer: " + gamer);
					Terminal.log("Human: " + human);

					TerminalPrompt.prompt(TerminalPromptType.string, "Enter your name", (name) => {
						Terminal.log("Hi " + name);
					}, "Person");
				},
				true
			);
		});
	},
	true
);
