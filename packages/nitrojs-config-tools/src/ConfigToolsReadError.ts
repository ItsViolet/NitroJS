/**
 * Errors that may be thrown while a config is being read
 */
enum ConfigToolsReadError {
    /**
     * The request file was not found
     */
    fileNotFound,

    /**
     * The path provided is a directory
     */
    pathIsDirectory,

    /**
     * The config contains errors
     */
    configContainsErrors,

    /**
     * A default export was not provided
     */
    noDefaultExport,

    /**
     * The exported type was not an object
     */
    objectNotExported
}
 
export default ConfigToolsReadError;
