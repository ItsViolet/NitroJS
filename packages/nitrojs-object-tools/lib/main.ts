import terminal from "@skylixgh/nitrojs-terminal";
import cliHighlight from "cli-highlight";
import mergeDeep from "merge-deep";
import { PartialDeep } from "type-fest";

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
 * @param allowExtendingBase Should the partial object be allowed to extend the base
 */
export function mergeObject<BaseType, PartialType>(baseObject: BaseType, partialObject: PartialType, allowExtendingBase?: boolean): BaseType;

/**
 * Merge two object together to create configurations
 * @param baseObject The base object
 * @param partialObject The object with certain or all properties missing
 * @param allowExtendingBase Should the partial object be allowed to extend the base
 */
export function mergeObject<BaseType>(baseObject: BaseType, partialObject: DeepPartial<BaseType>, allowExtendingBase?: boolean): BaseType;

export function mergeObject(baseObject: any, partialObject: any, allowExtendingBase = false): any {
    if (allowExtendingBase) {
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

    return mergeDeep({ ...baseObject }, { ...partialObject });
}

/**
 * Parse a JSON string into an object
 * @param json The JSON data as a string
 * @returns A promise containing the new parsed JSON object
 */
export function jsonParse<JsonDataType>(json: string): Promise<JsonDataType> {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(json));
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Dump an object for debugging purposes
 * @param dumpObject The object to dump for debugging
 */
export function dump(dumpObject: ObjectType | any[]) {
    terminal.log(terminal.hexColorize("Debug: ", "#999999") + "Dumping object bellow");

    console.log(
        cliHighlight(JSON.stringify(dumpObject, null, 2), {
            language: "json",
            ignoreIllegals: true
        })
    );

    terminal.log(terminal.hexColorize("Debug: ", "#999999") + "An object was dumped above");
}

/**
 * Make all interfaces properties become optional
 */
export type DeepPartial<InterfaceType> = PartialDeep<InterfaceType>;

const objectTools = {
    mergeObject,
    dump,
    jsonParse
};

export default objectTools;
