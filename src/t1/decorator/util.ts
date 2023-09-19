import { getOwnProperty, isAsyncFunction, isFunction, isObject } from "../../util";
import { RequestConfig } from "../types";
import { CONFIG_KEY, storeMap } from "./const";

export function getConfig(apiFunction: Function, constructor: Function){
    if(!isFunction(apiFunction) && !isAsyncFunction(apiFunction)){
        throw new Error("apiFunction must be a Function or AsyncFunction");
    }
    const key = constructor;
    const config: Map<any, any> = storeMap.get(key);
    // 挂载class身上的
    const classApiConfig = config.get(CONFIG_KEY) || {};
    const apiConfig = config.get("apis").get(apiFunction) || {};

    const fConfig: RequestConfig = {
        ...classApiConfig,
        ...apiConfig,
    }

    console.log("final config", fConfig);
    return fConfig;
}