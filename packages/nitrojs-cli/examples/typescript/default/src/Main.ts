import Terminal, { TerminalAnimation, TerminalPrompt } from "@skylixgh/nitrojs-terminal";
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

		TerminalAnimation.start([
			{
				label: "Checking if you ar a human",
				name: "human",
			},
		]);  
	}
})();
