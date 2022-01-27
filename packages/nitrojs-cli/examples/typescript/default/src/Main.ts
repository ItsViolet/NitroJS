import Fun from "./Second";

/**
 * Application main class
 */
new (class Main {
	/**
	 * Application main entry
	 */
	public constructor(args: string[] = []) {
        console.log("Hello world!");
        console.log(Fun.createdYear);
	}
})();
