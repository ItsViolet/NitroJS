import chalk from "chalk";
import { TerminalAnimationState, TerminalPrompt } from "../Terminal";
import AnimationItem from "./AnimationItem";
import AnimationMeta from "./AnimationMeta";

/**
 * Create animations in the terminal
 */
export default class TerminalAnimation {
	/**
	 * If the animation is running
	 */
	private static _isRunning = false;

	/**
	 * The animation items
	 */
	private static currentAnimationItems: AnimationItem[] = [];

	/**
	 * Current animation's meta
	 */
	private static currentAnimationMeta: AnimationMeta[] = [];

	/**
	 * Animation loop
	 */
	private static loop: NodeJS.Timer;

	/**
	 * The number of lines rendered
	 */
	private static linesRendered: null | number = null;

	/**
	 * Create animations
	 * @param animations The animation or animations
	 */
	public static startAnimation(animations: AnimationItem | AnimationItem[]) {
		if (TerminalPrompt.isRunning || this.isRunning) {
			return;
		}

		this._isRunning = true;
		this.currentAnimationItems = [];
		this.currentAnimationMeta = [];

		if (Array.isArray(animations)) this.currentAnimationItems = animations;
		else this.currentAnimationItems = [animations];

		const muted = chalk.hex("#999999");
		const defaultFrames = [muted("|"), muted("/"), muted("-"), muted("\\")];

		this.currentAnimationItems.forEach((animationItem) => {
			this.currentAnimationMeta.push({
				frame: 0,
				frames: animationItem.frames ?? defaultFrames,
				label: animationItem.label,
				name: animationItem.name,
				done: false,
				state: TerminalAnimationState.success
			});
		});

		this.loop = setInterval(() => {
			this.currentAnimationMeta.forEach((metaItem) => {
				metaItem.frame++;

				if (metaItem.frames.length == metaItem.frame) {
					metaItem.frame = 0;
				}
			});

			this.renderLines();
		}, 100);
	}

	/**
	 * If the animation is running
	 */
	public static get isRunning() {
		return this._isRunning;
	}

	/**
	 * Render all lines
	 */
	private static renderLines() {
		const render = () => {
			const lines = [] as string[];

			const getHexFromState = (state: TerminalAnimationState) => {
				let hex = "";
	
				console.log(state);
				switch (state) {
					case TerminalAnimationState.success:
						hex = "#50FFAB";
						break;
					
					case TerminalAnimationState.warning:
						hex = "#FFAB00";
						break;
					
					case TerminalAnimationState.info:
						hex = "#999999";
						break;

					case TerminalAnimationState.error:
						hex = "#FF5555";
						break;
				}

				return hex;
			}

			this.currentAnimationMeta.forEach((metaItem) => {
				const color = chalk.hex(getHexFromState(metaItem.state));
				lines.push(`${metaItem.done ? color("•") : metaItem.frames[metaItem.frame]} ${metaItem.label}`);
			});

			this.linesRendered = TerminalPrompt.renderLines(lines);
		};

		if (this.linesRendered) {
			TerminalPrompt.clearLinesFrom(-this.linesRendered);

			render();
			return;
		}

		render();
	}

	/**
	 * Stop an animation
	 * @param name Animation name
	 * @param newLabel New animation label
	 */
	public static stop(name: string, state: TerminalAnimationState, newLabel?: string) {
		this.renderLines();

		let stoppedAnimation = 0;

		this.currentAnimationMeta.forEach((metaItem) => {
			if (metaItem.name == name) {
				if (newLabel) metaItem.label = newLabel;
				
				metaItem.state = state;
				metaItem.done = true;
			}
		});

		this.currentAnimationMeta.forEach((metaItem) => {
			if (metaItem.done) {
				stoppedAnimation++;
			}
		});

		if (stoppedAnimation == this.currentAnimationMeta.length) {
			this._isRunning = false;
			clearInterval(this.loop);
		}
	}
}
