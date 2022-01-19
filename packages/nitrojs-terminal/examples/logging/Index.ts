import Terminal, { TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

Terminal.setTimeStampsMode(true);

Terminal.log("Hello world");
Terminal.success("A success message");
Terminal.warn("A warning");
Terminal.error("An error");

TerminalPrompt.prompt(TerminalPromptType.boolean, "Are you in school", (answer) => {
    Terminal.log("Answer received: " + answer);
});
