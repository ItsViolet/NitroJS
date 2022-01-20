// import Terminal, { TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

import { TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

// TerminalPrompt.prompt(
// 	TerminalPromptType.boolean,
// 	"Do you like NitroJS Full Stack Utility Framework?",
//     (answer) => {
// 		TerminalPrompt.prompt(
// 			TerminalPromptType.string,
// 			"What is your name",
// 			(answer2) => {
// 				Terminal.log("Nice to meet you " + answer2);
// 				if (answer) {
// 					Terminal.log("We're happy to know you like NitroJS!");
// 				} else {
// 					Terminal.log(
// 						"Awe, well let us know if there is anything we can do to improve NitroJS :)"
// 					);
// 				}
// 			},
// 			"XFaon"
// 		);
// 	},
// 	true
// );

TerminalPrompt.prompt(TerminalPromptType.boolean, "Are you a programmer?", (answer) => {
	console.log(answer);
});
