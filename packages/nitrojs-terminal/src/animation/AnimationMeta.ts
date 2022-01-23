import TerminalAnimationState from "./TerminalAnimationState";

/**
 * The animation meta item
 */
export default interface AnimationMeta {
	/**
	 * Animation name
	 */
	name: string | number;

	/**
	 * Animation label
	 */
	label: string;

	/**
	 * Current animation frame
	 */
	frame: number;

	/**
	 * Animation frames
	 */
	frames: string[];

	/**
	 * If the animation is done
	 */
	done: boolean;

	/**
	 * Animation state
	 */
	state: TerminalAnimationState;
}