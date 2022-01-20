import readline from "readline";
import chalk from "chalk";
import TerminalPrompt from "./TerminalPrompt";

/**
 * Class containing methods for creating string prompts
 */
export default class PromptString {
    /**
     * The number of lines rendered
     */
    private static linesRendered: null | number = null;

    /**
     * Ask a string based question
     * @param question The question to ask
     * @param callback The answer callback
     * @param defaultAnswer The default answer
     */
    public static handleStringInput(question: string, callback: (answer: string) => (void | string), defaultAnswer: string) {
        TerminalPrompt.addKeyListener((value, key) => {
            // TODO: C^ key press
            process.stdout.write(value + "");
        });
    }

    /**
     * Render all the lines
     */
    private static renderLines() {

    }
}