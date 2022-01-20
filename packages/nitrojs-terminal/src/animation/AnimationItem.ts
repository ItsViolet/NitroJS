/**
 * A simple animation item
 */
export default interface AnimationItem {
    /**
     * Animation label
     */
    label: string;

    /**
     * The name of the animation
     */
    name: string;

    /**
     * Animation frames
     */
    frames?: string[];
}