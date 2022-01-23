/**
 * NodeJS STDIN keypress key meta
 */
export default interface KeyPressMeta {
	/**
	 * Key sequence
	 */
	sequence: any;

	/**
	 * Key name
	 */
	name: string;

	/**
	 * If CTRL is being pressed
	 */
	ctrl: boolean;

	/**
	 * If SHIFT is being pressed
	 */
	shift: boolean;

	/**
	 * If ALT is being pressed
	 */
	alt: boolean;
}
