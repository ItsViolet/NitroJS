export type ObjectType = {
    [ index: string ]: any | ObjectType;
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

const objectTools = {
    mergeObject
};

export default objectTools;
