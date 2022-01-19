import TerminalPromptType from "./TerminalPromptType";

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
     */
    public prompt(type: TerminalPromptType.boolean, question: string, callback: (answer: boolean) => void): void;

    /**
     * Use a string based prompt
     * @param type The type of prompt
     * @param question The prompt question
     * @param callback The prompt callback
     */
    public prompt(type: TerminalPromptType.string, question: string, callback: (answer: string) => string): void;

    public prompt(type: TerminalPromptType, question: string, callback: any) {
        
    }

    /**
     * If a prompt is running
     */
    public static get isRunning() {
        return this._isRunning;
    }
}
