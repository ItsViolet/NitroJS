import { TerminalAnimation } from "../../src/Terminal";

TerminalAnimation.startAnimation([
	{
		label: "Hello world",
		name: "f",
		frames: [
			"[            ]",
			"[#           ]",
			"[##          ]",
			"[###         ]",
			"[#####       ]",
			"[######      ]",
			"[#######     ]",
			"[########    ]",
			"[#########   ]",
			"[##########  ]",
			"[############]",
		],
	},
	{
		label: "This is another animation",
		name: "s",
		frames: ["   ", ".  ", ".. ", "...", " ..", "  ."],
	},
]);
