import Terminal, {
	TerminalAnimation,
	TerminalAnimationState,
	TerminalPrompt,
} from "@skylixgh/nitrojs-terminal";
import Fun from "./Second";

/**
 * Application main class
 */
new (class Main {
	/**
	 * Application main entry
	 */
	public constructor(args: string[] = []) {
		Terminal.log("Hello, world!");
		TerminalPrompt.addKeyListener((value, key) => {
			if (key.name == "c" && key.ctrl) process.exit(0);
		});

		const frames = ["    ", ".   ", "..  ", "... ", " ...", "  ..", "   ."] as string[];

		TerminalAnimation.start([
			{
				label: "Checking if you ar a human",
				name: "human",
				frames,
			},
			{
				label: "Checking nodejs version",
				name: "-v",
				frames,
			},
		]);

		setTimeout(() => {
			TerminalAnimation.stop("human", TerminalAnimationState.success, "You are a human!");
			TerminalAnimation.stop("-v", TerminalAnimationState.warning, "Could not detect");
		}, 1500);
	}
})();
