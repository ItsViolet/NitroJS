import { PartialDeep } from "type-fest";
import Terminal, { LogCustomTagSettings, TerminalPrompt, TerminalPromptType } from "../../src/Terminal";

Terminal.setTimeStampsMode(true);

Terminal.log("Hello world");
Terminal.success("A success message");
Terminal.warn("A warning");
Terminal.error("An error");
Terminal.notice("Notice alert");

Terminal.logCustomTag("NitroJS Test", {
    tagPrefix: "Test Tag"
});

Terminal.logCustomTag("Hello word", {
    useColorThroughout: true,
    tagPrefix: "aaaa",
    hexColor: "#19F175"
});

TerminalPrompt.prompt(
	TerminalPromptType.boolean,
	"Are you in school Are you in school Are you in school Are you in school Are you in school Are you in school Are you in school Are you in school Are you in school",
	(answer) => {
		Terminal.log("Answer received: " + answer);
	}
);
