import AppConfigType from "../../../interfaces/AppConfigType";

/**
 * All the answers from prompts after initialize prompts are done
 */
export default interface InitAnswers {
    /**
     * Information for the package
     */
    project: {
        /**
         * The project name
         */
        name: string;

        /**
         * The project description
         */
        description: string;

        /**
         * Project license
         */
        license: string;

        /**
         * The project version
         */
        version: string;

        /**
         * The project author
         */
        author: string;

        /**
         * The project keywords
         */
        keywords: string[];
    }

    /**
     * Whether to use TypeScript or not
     */
    typeScript: boolean;

    /**
     * What type of application will NitroJS try to execute
     */
    type: AppConfigType;

    /**
     * The GIT origin
     */
    gitOriginUrl?: string;
}
