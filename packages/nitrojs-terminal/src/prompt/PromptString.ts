import readline from "readline";
import chalk from "chalk";

/**
 * A string prompt handler
 */
export default class PromptString {
    /**
     * Ask a string based question
     * @param question The question to ask
     * @param callback The answer callback
     * @param defaultAnswer The default answer
     */
    public static handleStringInput(question: string, callback: (answer: string) => (void | string), defaultAnswer: string) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const questionTxt = `> ${question}:  `;
        let outputText = "";

        function render() {
            process.stdout.moveCursor(-process.stdout.columns, 0);
            process.stdout.write(questionTxt + outputText + "                                    ");
        }

        function keyPressHandle(value: string, key: any) {
            if (key.name == "c" && key.ctrl) {
                process.stdout.write("\n");
                process.exit();
            }

            if (value) {
                console.log([ value, key ])

                if (key.name == "backspace" && outputText.length != 0) {
                    outputText = outputText.slice(0, -1);
                } else {
                    outputText += value;
                }
            }

            render();
        }

        process.stdin.on("keypress", keyPressHandle);
    }
}