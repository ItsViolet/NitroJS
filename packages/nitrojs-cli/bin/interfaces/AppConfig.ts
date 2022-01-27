import AppConfigType from "./AppConfigType";

/**
 * The application configuration
 */
export default interface AppConfig {
	/**
	 * The type of application
	 */
	type: AppConfigType;

	/**
	 * Settings for Node apps
	 */
	node: {
		/**
		 * Program execution settings
		 */
		program: {
			/**
			 * Program execution arguments that should be passed to the entry script
			 */
			args: string[];
		}

		/**
		 * Files and directories to exclude compilation of
		 */
		excludes: string[];
	}
}
