import Terminal, {
	TerminalPrompt,
	TerminalPromptSelect,
	TerminalPromptString,
} from "@skylixgh/nitrojs-terminal";

TerminalPromptString.prompt(
	"Please enter a number to see if its even or odd",
	(answer) => {
		console.log(answer);
		if (+answer % 2 == 0) {
			Terminal.log("The number is even");
		} else {
			Terminal.log("The number is odd");
		}
	},
	"1",
	(number) => {
		if (isNaN(number as any)) {
			return "Please enter a number";
		}
	}
);
