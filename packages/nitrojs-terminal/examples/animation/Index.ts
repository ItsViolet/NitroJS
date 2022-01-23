import { TerminalAnimation, TerminalAnimationState } from "../../src/Terminal";

TerminalAnimation.start([
	{
		label: "Starting core service",
		name: "core",
	},
	{
		label: "Starting dev server",
		name: "dev",
	},
]);

setTimeout(() => {
	TerminalAnimation.stopAll(
		"core",
		TerminalAnimationState.error,
		"Couldn't start core because it does't exist"
	);
}, 1000);
