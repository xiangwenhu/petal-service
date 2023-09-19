import { isAsyncFunction, isFunction, isObject } from "../../util";
import { RequestConfig } from "../types";
import { CONFIG_KEY } from "./const";

export function getBaseConfig(apiFunction: Function,
    constructor: Function,
    defaults: RequestConfig = {},
    storeMap: Map<any, any>) {
    if (!isObject(apiFunction) && !isFunction(apiFunction) && !isAsyncFunction(apiFunction)) {
        throw new Error("apiFunction must be a Function or AsyncFunction");
    }
    const key = constructor;
    const config: Map<any, any> = storeMap.get(key);
    // 挂载class身上的
    const classApiConfig = config.get(CONFIG_KEY) || {};
    const apiConfig = config.get("apis").get(apiFunction) || {};

    const fConfig: RequestConfig = {
        // 初始化默认值
        ...defaults,
        // class装饰器上的默认值
        ...classApiConfig,
        // api上配置的默认值
        ...(apiConfig.config || {}),
    }

    console.log("final config", fConfig);
    return {
        config: fConfig,
        hasParams: apiConfig.params || false,
        hasBody: apiConfig.body || false,
        hasExtraConfig: apiConfig.config || false
    };
}