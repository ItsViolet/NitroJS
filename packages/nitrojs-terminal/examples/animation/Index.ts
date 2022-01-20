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
	
	setTimeout(() => {
		TerminalAnimation.stop("f", TerminalAnimationState.error, "Bye world");

		setTimeout(() => {
			TerminalAnimation.stop("gamer", TerminalAnimationState.error, "Gamer loaded");
		}, 1000);
	}, 1500);
}, 1000);
