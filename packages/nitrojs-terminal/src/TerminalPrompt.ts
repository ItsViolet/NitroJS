import TerminalPromptType from "./TerminalPromptType";

export default class TerminalPrompt {
    /**
     * If a prompt is running
     */
    private static _isRunning = false;

    public prompt(type: TerminalPromptType) {
        
    }

    /**
     * If a prompt is running
     */
    public static get isRunning() {
        return this._isRunning;
    }
}
