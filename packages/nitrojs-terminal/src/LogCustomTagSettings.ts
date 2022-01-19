/**
 * Settings for logging with a custom tag
 */
export default interface LogCustomTagSettings {
	/**
	 * The tag prefix text
	 */
	tagPrefix: string;

	/**
	 * The hex color of the prefix text color
	 */
	hexColor: string;

	/**
	 * Use the hex color of the prefix on the text
	 */
	useColorThroughout: boolean;
}
