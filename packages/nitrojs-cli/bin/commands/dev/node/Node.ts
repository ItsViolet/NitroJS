import CommandFlags from "../CommandFlags";
import path from "path";
import CacheStore from "../CacheStore";

/**
 * Class for handling NodeJS based dev server applications
 */
export default class Node {
    /**
     * NodeJS dev server controller
     * @param flags Command flags
     * @param projectRoot Project root
     */
    public constructor(flags: CommandFlags, projectRoot: string) {
        this.startDevServer(projectRoot);
    }

    /**
     * Start the development server
     * @param projectRoot Project root
     */
    public startDevServer(projectRoot: string) {
        CacheStore.initialize(path.join(process.cwd(), ));
    }
}
