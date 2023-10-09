
import { isMergeAbleObject } from "./is-mergeable-object";

export interface MergeOptions {
    arrayMerge?(target: any[], source: any[], options?: MergeOptions): any[];
    clone?: boolean;
    customMerge?: (key: PropertyKey, options?: MergeOptions) => ((x: any, y: any) => any) | undefined;
    isMergeAbleObject?(value: object): boolean;
}
export interface ArrayMergeOptions {
    isMergeAbleObject(value: object): boolean;
    cloneUnlessOtherwiseSpecified(value: object, options?: MergeOptions): object;
}

function emptyTarget(val: any) {
    return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value: any, options: MergeOptions): any {
    return (options.clone !== false && options.isMergeAbleObject!(value)) ? deepMerge(emptyTarget(value), value, options)
        : value
}

function defaultArrayMerge(target: any, source: any, options: MergeOptions) {
    return target.concat(source).map(function (element: any) {
        return cloneUnlessOtherwiseSpecified(element, options)
    })
}

function getMergeFunction(key: PropertyKey, options: MergeOptions) {
    if (!options.customMerge) {
        return deepMerge
    }
    var customMerge = options.customMerge(key)
    return typeof customMerge === 'function' ? customMerge : deepMerge
}

function getEnumerableOwnPropertySymbols(target: any) {
    return Object.getOwnPropertySymbols
        ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
            return Object.propertyIsEnumerable.call(target, symbol)
        })
        : []
}

function getKeys(target: any) {
    // @ts-ignore
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object: any, property: PropertyKey) {
    try {
        return property in object
    } catch (_) {
        return false
    }
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target: any, key: PropertyKey) {
    return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
        && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
            && Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target: any, source: any, options: MergeOptions) {
    var destination = {}
    if (options.isMergeAbleObject!(target)) {
        getKeys(target).forEach(function (key) {
            // @ts-ignore
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options)
        })
    }
    getKeys(source).forEach(function (key) {
        if (propertyIsUnsafe(target, key)) {
            return
        }

        if (propertyIsOnObject(target, key) && options.isMergeAbleObject!(source[key])) {
            // @ts-ignore
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options)
        } else {
            // @ts-ignore
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options)
        }
    })
    return destination
}

function deepMerge(target: any, source: any, options: MergeOptions) {
    options = options || {};
    // @ts-ignore
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeAbleObject = options.isMergeAbleObject || isMergeAbleObject;
    // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.
    // @ts-ignore
    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

    var sourceIsArray = Array.isArray(source)
    var targetIsArray = Array.isArray(target)
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray

    if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options)
    } else if (sourceIsArray) {
        return options.arrayMerge!(target, source, options)
    } else {
        return mergeObject(target, source, options)
    }
}

export function merge(array: any[], options: MergeOptions = {}) {
    if (!Array.isArray(array)) {
        throw new Error('first argument should be an array')
    }

    return array.reduce(function (prev, next) {
        return deepMerge(prev, next, options)
    }, {})
}
