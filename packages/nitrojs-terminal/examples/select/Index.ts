import Terminal, { TerminalPromptBoolean, TerminalPromptSelect } from "../../src/Terminal";

TerminalPromptSelect.prompt(
	"What is your favorite framework?",
	[
		{
			label: "ReactJS",
			value: "ReactJS",
		},
		{
			label: "VueJS",
			value: "VueJS",
		},
		{
			label: "AngularJS",
			value: "AngularJS",
		},
		{
			label: "EmberJS",
			value: "EmberJS",
		},
	],
	(answer) => {
		TerminalPromptSelect.prompt(
			"What is your favorite HTML preprocessor",
			[
				{
					label: "PHP",
					value: "PHP",
				},
				{
					label: "ASP",
					value: "ASP",
				},
			],
			(prep) => {
				TerminalPromptSelect.prompt(
					"Select your favorite JavaScript processor",
					[
						{
							label: "None",
							value: "None",
						},
						{
							label: "TypeScript",
							value: "TypeScript",
						},
						{
							label: "CoffeeScript",
							value: "CoffeeScript",
						},
					],
					(jsPrep) => {
						Terminal.log("Favorite JS framework: " + answer);
						Terminal.log("Favorite HTML preprocessor: " + prep);
						Terminal.log("Favorite JS preprocessor: " + jsPrep);
					}
				);
			}
		);
	},
	"ReactJS"
);
