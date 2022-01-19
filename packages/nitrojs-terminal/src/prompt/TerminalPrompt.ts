import TerminalPromptType from "../TerminalPromptType";
import PromptBoolean from "./PromptBoolean";

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
    public static prompt(type: TerminalPromptType.string, question: string, callback: (answer: string) => string, defaultValue?: boolean): void;

    public static prompt(type: TerminalPromptType, question: string, callback: any, defaultValue = false) {
        this._isRunning = true;
        
        if (type == TerminalPromptType.boolean) {
            PromptBoolean.handleBooleanInput(question, (answer) => {
                this._isRunning = false;
                callback(answer);
            }, defaultValue);
        }
    }

    /**
     * If a prompt is running
     */
    public static get isRunning() {
        return this._isRunning;
    }
}
