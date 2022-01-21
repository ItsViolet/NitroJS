/**
 * A select prompt
 */
export default class TerminalPromptSelect {
	/**
	 * If is running
	 */
	private static _isRunning = false;

	/**
	 * Ask a select box
	 * @param question The question and answers
	 * @param callback The answer callback
	 */
	public static handleSelectInput(
		question: { label: string; options: { label: string; name: string }[] },
		callback: (answer: string) => void,
		defaultAnswer: string
	) {}

	/**
	 * If is running
	 */
	public static get isRunning() {
		return this._isRunning;
	}
}
