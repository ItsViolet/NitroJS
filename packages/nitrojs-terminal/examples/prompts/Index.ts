// import Terminal, { TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

import { TerminalPrompt } from "../../src/Terminal";

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

const frames = [ "[     ]", "[ .   ]", "[ ..  ]", "[ ... ]", "[  .. ]", "[   . ]" ];
let frame = 0;

let rendered = TerminalPrompt.renderLines([" - Hello World", " - Hello NitroJS"]);

setInterval(() => {
	TerminalPrompt.clearLinesFrom(-rendered);

	frame++;

	if (frame == frames.length) {
		frame = 0;
	}

	console.log(` ${frames[frame]} First spinner`);
	console.log(` ${frames[frame]} Second spinner`);
}, 100);
