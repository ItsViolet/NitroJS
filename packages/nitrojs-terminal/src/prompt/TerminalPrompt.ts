import TerminalPromptType from "../TerminalPromptType";
import PromptBoolean from "./PromptBoolean";
import PromptString from "./PromptString";

/**
 * Create interactive prompts in the terminal
 */
export default class TerminalPrompt {
    /**
     * If a prompt is running
     */
    private static _isRunning = false;

    /**
     * Use a yes or no boolean based prompt
     * @param type The type of prompt
     * @param question The prompt question
     * @param callback The prompt answer callback
     * @param defaultValue The default value
     */
    public static prompt(type: TerminalPromptType.boolean, question: string, callback: (answer: boolean) => void, defaultValue?: boolean): void;

    /**
     * Use a string based prompt
     * @param type The type of prompt
     * @param question The prompt question
     * @param callback The prompt callback
     * @param defaultValue The default value
     */
    public static prompt(type: TerminalPromptType.string, question: string, callback: (answer: string) => (void | string), defaultValue?: string): void;

    public static prompt(type: TerminalPromptType, question: string, callback: any, defaultValue?: any) {
        this._isRunning = true;
        
        if (type == TerminalPromptType.boolean) {
            PromptBoolean.handleBooleanInput(question, (answer) => {
                this._isRunning = false;
                callback(answer);
            }, defaultValue ?? false);
        } else if (type == TerminalPromptType.string) {
            PromptString.handleStringInput(question, (answer) => {
                this._isRunning = false;
                callback(answer);
            }, defaultValue ?? "");
        }
    }

    /**
     * If a prompt is running
     */
    public static get isRunning() {
        return this._isRunning;
    }

    /**
     * Clear all lines from and below the relative number
     * @param lineNumberRelative The line number relative to the current cursor position
     */
    public static clearLinesFrom(lineNumberRelative: number) {
        process.stdout.moveCursor(0, lineNumberRelative);
        process.stdout.clearScreenDown();
    }

    /**
     * Render a group or a single line
     * @param lines The line or lines as an array
     * @returns Number of lines rendered
     */
    public static renderLines(lines: string | string[]) {
        const linesArray = [];
        let linesRendered = 0;

        if (Array.isArray(lines)) {
            linesArray.push(...lines);
        } else {
            linesArray.push(lines);
        }

        linesArray.forEach(line => {
            process.stdout.write(line + "\n");
            linesRendered++;
        });

        return linesRendered;
    }
}
