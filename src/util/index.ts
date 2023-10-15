import axios from "axios";
import { RequestConfig } from "../types";

const toString = Object.prototype.toString;
const hasOwnProp = Object.prototype.hasOwnProperty;

export function isType(obj: any, type: string) {
    return toString.call(obj) === `[object ${type}]`;
}

export function isFunction(obj: any) {
    return typeof obj === "function" || isType(obj, "Function");
}

export function isAsyncFunction(obj: any) {
    return isType(obj, "AsyncFunction");
}

export function isObject(obj: any) {
    return isType(obj, "Object");
}

export function getOwnProperty(
    obj: any,
    propertyName: PropertyKey,
    defaultValue?: any
) {
    //  Cannot convert undefined or null to object
    if (obj != null && hasOwnProp.call(obj, propertyName)) {
        return obj[propertyName];
    }
    return defaultValue || undefined;
}

export function getProperty(
    obj: any,
    propertyName: PropertyKey,
    defaultValue?: any
) {
    //  Cannot convert undefined or null to object
    if (obj != null) {
        return obj[propertyName];
    }
    return defaultValue || undefined;
}

export function hasOwnProperty(obj: any, propertyName: PropertyKey) {
    if (obj === null || obj === undefined) {
        return false;
    }
    return hasOwnProp.call(obj, propertyName);
}

export function createRequestInstance(config: RequestConfig) {
    return axios.create(config);
}

export function cloneJSON<T>(obj: any, defaultValue: any = {}) {
    try {
        return JSON.parse(JSON.stringify(obj)) as T;
    } catch (err) {
        return defaultValue;
    }
}
