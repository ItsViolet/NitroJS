import { TerminalPromptSelect } from "../../src/Terminal";

TerminalPromptSelect.prompt("What is your favourite framework?", [
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
    console.log(answer);
}, "rjs");