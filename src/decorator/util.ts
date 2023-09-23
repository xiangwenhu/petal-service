import { merge } from "lodash";
import { StorageMap, StorageMapValue } from "../other.type";
import { Method, RequestConfig } from "../types";
import {
    getOwnProperty,
    hasOwnProperty,
    isAsyncFunction,
    isFunction,
    isObject,
} from "../util";
import { hasPathParams, pathToUrl } from "../util/path";
import { STORE_KEYS } from "../const";

const NOT_USE_BODY_METHODS: Method[] = ["get", "head", "GET", "HEAD"];

function shouldUseBody(method: Method) {
    return !NOT_USE_BODY_METHODS.includes(method.toLowerCase() as Method);
}

/**
 * 获取最终的配置
 * @param method method的函数
 * @param instance class的实例
 * @param defaultConfig 默认值
 * @param argumentsObj method实参
 * @param storeMap 存储
 * @returns
 */
export function getMethodConfig(
    method: Function,
    instance: Object,
    defaultConfig: RequestConfig = {},
    argumentsObj: ArrayLike<any>,
    storeMap: StorageMap
) {
    if (!isObject(method) && !isFunction(method) && !isAsyncFunction(method)) {
        throw new Error(
            "methodFunction must be a/an Object|Function|AsyncFunction"
        );
    }
    const key = instance.constructor;
    const config: StorageMapValue = storeMap.get(key) || new Map();
    // 挂载class身上的
    const classConfig = config.get(STORE_KEYS.classConfig) || {};
    const methodConfig =
        (config.get("methods") as StorageMapValue.MethodsMapValue).get(
            method
        ) || {};

    // 实例
    const instances: StorageMapValue.InstancesMapValue =
        (config.get(STORE_KEYS.instancesFieldPropertyMap) as StorageMapValue.InstancesMapValue) ||
        new Map();
    const instancePropertyMap = instances.get(instance) || {};

    const instanceConfig = Object.entries(instancePropertyMap).reduce(
        (obj: RequestConfig, [key, value]) => {
            if (hasOwnProperty(instance, value)) {
                // @ts-ignore
                obj[key] = getOwnProperty(instance, value);
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
        // method 上的配置
        ...(methodConfig.config || {}),
    };

    mConfig = adjustConfig(mConfig, argumentsObj, methodConfig);

    return mConfig;
}

/**
 * 获取最终的配置
 * @param method method的函数
 * @param _class_ class的实例
 * @param defaultConfig 默认值
 * @param argumentsObj api实参
 * @param storeMap 存储
 * @returns
 */
export function getStaticMethodConfig(
    method: Function,
    _class_: Function,
    defaultConfig: RequestConfig = {},
    argumentsObj: ArrayLike<any>,
    storeMap: StorageMap
) {
    if (!isObject(method) && !isFunction(method) && !isAsyncFunction(method)) {
        throw new Error(
            "methodFunction must be a/an Object|Function|AsyncFunction"
        );
    }
    const key = _class_;
    const config: StorageMapValue = storeMap.get(key) || new Map();
    // 挂载class身上的
    const classConfig = config.get(STORE_KEYS.classConfig) || {};
    const methodConfig: StorageMapValue.MethodConfigValue =
        (config.get("staticMethods") as StorageMapValue.MethodsMapValue).get(
            method
        ) || {};

    const staticPropertyMap: StorageMapValue.FieldPropertyMapValue =
        (config.get(
            STORE_KEYS.staticFieldPropertyMap
        ) as StorageMapValue.FieldPropertyMapValue) || {};

    const staticConfig = Object.entries(staticPropertyMap).reduce(
        (obj: RequestConfig, [key, value]) => {
            if (hasOwnProperty(_class_, value)) {
                // @ts-ignore
                obj[key] = getOwnProperty(_class_, value);
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
        // class 静态配置
        ...staticConfig,
        // method 上配置的默认值
        ...(methodConfig.config || {}),
    };

    mConfig = adjustConfig(mConfig, argumentsObj, methodConfig);

    return mConfig;
}

function getDefaultParamsOptions(
    method: Method
): StorageMapValue.MethodParamsOptions {
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
    methodConfig: StorageMapValue.MethodConfigValue
): RequestConfig<any> {
    let argLength = argumentsObj.length;
    let { config, ...userOptions }: StorageMapValue.MethodConfigValue =
        methodConfig;

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

export function updateFieldConfig(
    storeMap: StorageMap,
    _class_: Function,
    instance: Object,
    config: Record<PropertyKey, PropertyKey>
) {
    const instancesKey = STORE_KEYS.instancesFieldPropertyMap;

    const val: StorageMapValue = storeMap.get(_class_) || new Map();
    let instances: StorageMapValue.InstancesMapValue = val.get(
        instancesKey
    ) as StorageMapValue.InstancesMapValue;
    if (!instances) {
        instances = new Map();
        val.set(instancesKey, instances);
    }
    const oldConfig: StorageMapValue.FieldPropertyMapValue =
        instances.get(instance) || {};
    Object.assign(oldConfig, config);
    instances.set(instance, oldConfig);
    storeMap.set(_class_, val);
}

export function updateStaticFieldConfig(
    storeMap: StorageMap,
    _class_: Function,
    _instance: Object,
    mapConfig: Record<PropertyKey, PropertyKey>
) {
    const staticConfigKey = STORE_KEYS.staticFieldPropertyMap;

    const val: StorageMapValue = storeMap.get(_class_) || new Map();
    let oldConfig: StorageMapValue.ConfigValue =
        (val.get(staticConfigKey) as StorageMapValue.ConfigValue) || {};
    Object.assign(oldConfig, mapConfig);
    val.set(staticConfigKey, oldConfig);
    storeMap.set(_class_, val);
}

export function updateMethodConfig(
    storeMap: StorageMap,
    _class_: Function,
    method: Function,
    config: StorageMapValue.MethodConfigValue
) {
    innerUpdateStaticMethodConfig(storeMap, _class_, method, config, "methods");
}

export function updateStaticMethodConfig(
    storeMap: StorageMap,
    _class_: Function,
    method: Function,
    config: StorageMapValue.MethodConfigValue
) {
    innerUpdateStaticMethodConfig(
        storeMap,
        _class_,
        method,
        config,
        "staticMethods"
    );
}

function innerUpdateStaticMethodConfig(
    storeMap: StorageMap,
    _class_: Function,
    method: Function,
    config: StorageMapValue.MethodConfigValue,
    key: "methods" | "staticMethods"
) {
    const val: StorageMapValue = storeMap.get(_class_) || new Map();
    let methodsMapValue: StorageMapValue.MethodsMapValue = val.get(
        key
    ) as StorageMapValue.MethodsMapValue;
    if (!methodsMapValue) {
        methodsMapValue = new Map();
        val.set(key, methodsMapValue);
    }
    const oldConfig: StorageMapValue.MethodConfigValue =
        methodsMapValue.get(method) || {};
    Object.assign(oldConfig, config);
    methodsMapValue.set(method, oldConfig);
    storeMap.set(_class_, val);
}
