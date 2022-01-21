// import Terminal, { TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

import Terminal, { TerminalAnimation, TerminalAnimationState, TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

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

						TerminalAnimation.startAnimation([
							{
								label: "Fetching gamer",
								name: "g-f"
							},
							{
								label: "Fetching friends",
								name: "f-f"
							}
						]);

						setTimeout(() => {
							TerminalAnimation.stop("g-f", TerminalAnimationState.success, "We got the gamer!");

							setTimeout(() => {
								TerminalAnimation.stop("f-f", TerminalAnimationState.success, "We got the friends!");
							}, 1000);
						}, 1500);
					}, "Person");
				},
				true
			);
		});
	},
	true
);
