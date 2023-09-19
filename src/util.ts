
const toString = Object.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function isType(obj: any, type: string) {
    return toString.call(obj) === `[object ${type}]`
}

export function isFunction(obj: any) {
    return isType(obj, "Function")
}

export function isAsyncFunction(obj: any) {
    return isType(obj, 'AsyncFunction')
}

export function isObject(obj: any) {
    return isType(obj, "Object")
}


export function getOwnProperty(obj: any, propertyName: PropertyKey, defaultValue?: any) {
    //  Cannot convert undefined or null to object
    if (obj != null && hasOwnProperty.call(obj, propertyName)) {
        return obj[propertyName]
    }
    return defaultValue || undefined;
}