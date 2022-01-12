import terminal from "@skylixgh/nitrojs-terminal";
import cliHighlight from "cli-highlight";

/**
 * Better data type for dynamic objects with no restricted types
 */
export type ObjectType = {
    [index: string]: any | ObjectType;
};

/**
 * Merge two object together to create configurations
 * @param baseObject The base object
 * @param partialObject The object with certain or all properties missing
 */
export function mergeObject<BaseType, PartialType>(baseObject: BaseType, partialObject: PartialType): BaseType;

/**
 * Merge two object together to create configurations
 * @param baseObject The base object
 * @param partialObject The object with certain or all properties missing
 */
export function mergeObject<BaseType>(baseObject: BaseType, partialObject: BaseType): BaseType;

export function mergeObject(baseObject: any = {}, partialObject: any = {}): any {
    const recursiveResult = {} as any;

    for (const objectKey in { ...baseObject }) {
        if (partialObject.hasOwnProperty(objectKey)) {
            if (typeof partialObject[objectKey] == "object" && !Array.isArray(partialObject[objectKey])) {
                recursiveResult[objectKey] = mergeObject(baseObject[objectKey], partialObject[objectKey]);
            } else {
                recursiveResult[objectKey] = partialObject[objectKey];
            }
        } else {
            recursiveResult[objectKey] = baseObject[objectKey];
        }
    }

    return recursiveResult;
}

/**
 * Dump an object for debugging purposes
 * @param dumpObject The object to dump for debugging
 */
export function dump(dumpObject: ObjectType | any[]) {
    terminal.log(terminal.hexColorize("Debug: ", "#999999") + "Dumping object bellow");

    console.log(cliHighlight(
        JSON.stringify(dumpObject, null, 2),
        {
            language: "json",
            ignoreIllegals: true
        }
    ));

    terminal.log(terminal.hexColorize("Debug: ", "#999999") + "An object was dumped above");
}

const objectTools = {
    mergeObject,
    dump
};

export default objectTools;
