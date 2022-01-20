import { TerminalAnimation, TerminalAnimationState } from "../../src/Terminal";

TerminalAnimation.startAnimation([
	{
		label: "Hello world",
		name: "f"
	},
	{
		label: "This is another animation",
		name: "s"
    },
    {
        label: "Loading your gamer self",
        name: "gamer"
    }
]);

setTimeout(() => {
    TerminalAnimation.stop("s", TerminalAnimationState.error, "An error lol");
}, 1000);
