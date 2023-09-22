import {
    isAsyncFunction,
    isFunction,
    isObject,
    getOwnProperty,
    hasOwnProperty,
} from "../util";
import { StorageMap, StorageMapValue } from "../other.type";
import { RequestConfig, Method } from "../types";
import { STORE_KEY_CONFIG } from "../const";
import { has, merge } from "lodash";
import { hasPathParams, pathToUrl } from "../util/path";

const NOT_USE_BODY_METHODS: Method[] = ["get", "head", "GET", "HEAD"];

function shouldUseBody(method: Method) {
    return !NOT_USE_BODY_METHODS.includes(method.toLowerCase() as Method);
}

/**
 * 获取最终的配置
 * @param apiFunction api对象的函数
 * @param classInstance class的实例
 * @param constructor class
 * @param defaultConfig 默认值
 * @param argumentsObj api实参
 * @param storeMap 存储
 * @returns
 */
export function getBaseConfig(
    apiFunction: Function,
    classInstance: Object,
    defaultConfig: RequestConfig = {},
    argumentsObj: ArrayLike<any>,
    storeMap: StorageMap
) {
    if (
        !isObject(apiFunction) &&
        !isFunction(apiFunction) &&
        !isAsyncFunction(apiFunction)
    ) {
        throw new Error(
            "apiFunction must be a/an Object|Function|AsyncFunction"
        );
    }
    const key = classInstance.constructor;
    const config: StorageMapValue = storeMap.get(key) || new Map();
    // 挂载class身上的
    const classConfig = config.get(STORE_KEY_CONFIG) || {};
    const apiConfig = config.get("apis").get(apiFunction) || {};

    // 实例
    const instances: StorageMapValue.InstancesMapValue =
        config.get("instances") || new Map();
    const instancePropertyMap = instances.get(classInstance) || {};

    const instanceConfig = Object.entries(instancePropertyMap).reduce(
        (obj: RequestConfig, [key, value]) => {
            if (hasOwnProperty(classInstance, value)) {
                // @ts-ignore
                obj[key] = getOwnProperty(classInstance, value);
            }
            return obj;
        },
        {}
    );

    let mConfig: RequestConfig = {
        // 初始化默认值
        ...defaultConfig,
        // class装饰器上的默认值
        ...classConfig,
        // class实例的值
        ...instanceConfig,
        // api上配置的默认值
        ...(apiConfig.config || {}),
    };

    mConfig = adjustConfig(mConfig, argumentsObj, apiConfig);

    return mConfig;
}

function getDefaultParamsOptions(
    method: Method
): StorageMapValue.APIValueParamsOptions {
    if (shouldUseBody(method)) {
        return {
            hasBody: true,
            hasConfig: true,
            hasParams: true,
        };
    }
    return {
        hasBody: false,
        hasConfig: true,
        hasParams: true,
    };
}

function adjustConfig(
    mConfig: RequestConfig,
    argumentsObj: ArrayLike<any>,
    apiConfig: StorageMapValue.APIConfigValue
): RequestConfig<any> {
    let argLength = argumentsObj.length;
    let { config, ...userOptions }: StorageMapValue.APIConfigValue = apiConfig;

    const defaultOptions = getDefaultParamsOptions(mConfig.method as Method);
    const {
        hasBody,
        hasConfig: hasExtraConfig,
        hasParams,
    } = {
        hasBody: defaultOptions.hasBody || userOptions.hasBody,
        hasParams: defaultOptions.hasParams || userOptions.hasParams,
        hasConfig: defaultOptions.hasConfig || userOptions.hasConfig,
    };

    const isHavePathParams = hasPathParams(mConfig.url || "");

    let expectedLength = 0;

    // 有路径参数
    if (argLength > 0 && isHavePathParams) {
        expectedLength++;
        mConfig.url = pathToUrl(
            mConfig.url || "",
            argumentsObj[expectedLength - 1]
        );
    }

    // 有请求参数
    if (argLength > 0 && hasParams) {
        expectedLength++;
        mConfig.params = argumentsObj[expectedLength - 1] || {};
    }
    // TODO: 有body
    if (argLength > 0 && hasBody) {
        expectedLength++;
        if (argLength >= expectedLength) {
            mConfig.data = argumentsObj[expectedLength - 1];
        }
    }
    // 额外的配置Config
    if (argLength > 0 && hasExtraConfig) {
        expectedLength++;
        if (argLength >= expectedLength) {
            mConfig = merge(mConfig, argumentsObj[expectedLength - 1]);
        }
    }

    return mConfig;
}

export function updateFiledConfig(
    storeMap: StorageMap,
    key: Function,
    instance: Object,
    config: Record<PropertyKey, PropertyKey>
) {
    const val: StorageMapValue = storeMap.get(key) || new Map();
    let instances: StorageMapValue.InstancesMapValue = val.get("instances");
    if (!instances) {
        instances = new Map();
        val.set("instances", instances);
    }
    const oldConfig: StorageMapValue.InstanceValue =
        instances.get(instance) || {};
    Object.assign(oldConfig, config);
    instances.set(instance, oldConfig);
    storeMap.set(key, val);
}

export function updateAPIConfig(
    storeMap: StorageMap,
    key: Function,
    api: Function,
    config: StorageMapValue.APIConfigValue
) {
    const val: StorageMapValue = storeMap.get(key) || new Map();
    let apis: StorageMapValue.APISMapValue = val.get("apis");
    if (!apis) {
        apis = new Map();
        val.set("apis", apis);
    }
    const oldConfig: StorageMapValue.APIConfigValue = apis.get(api) || {};
    Object.assign(oldConfig, config);
    apis.set(api, oldConfig);
    storeMap.set(key, val);
}
