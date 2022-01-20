import Terminal, { TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

TerminalPrompt.prompt(TerminalPromptType.boolean, "Do you like NitroJS", (answer) => {
    if (answer) {
        Terminal.log("We're happy to know you like NitroJS!");
    } else {
        Terminal.log("Awe, well let us know if there is anything we can do to improve NitroJS :)");
    }
}, true);
