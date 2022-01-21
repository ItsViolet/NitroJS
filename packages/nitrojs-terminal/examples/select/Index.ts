import Terminal, { TerminalPromptBoolean, TerminalPromptSelect } from "../../src/Terminal";

TerminalPromptSelect.prompt("What is your favorite framework?", [
    {
        label: "React",
        value: "rjs"
    },
    {
        label: "Vue",
        value: "vjs"
    },
    {
        label: "Angular",
        value: "ajs"
    }
], answer => {
    TerminalPromptBoolean.prompt("Do you use this framework daily?", (ans) => {
			Terminal.log("Cool! Seems like you use " + answer);
		});
}, "rjs");