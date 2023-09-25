import { merge } from "lodash";
import { StorageMap, StorageMapValue } from "./other.type";
import { Method, RequestConfig } from "./types";
import {
    getOwnProperty,
    hasOwnProperty,
    isAsyncFunction,
    isFunction,
    isObject,
} from "./util";
import { hasPathParams, pathToUrl } from "./util/path";
import { STORE_KEYS } from "./const";

// 不会有body的请求
const NOT_USE_BODY_METHODS: Method[] = ["get", "head", "GET", "HEAD"];

function shouldUseBody(method: Method) {
    return !NOT_USE_BODY_METHODS.includes(method.toLowerCase() as Method);
}


export default class DataStore {
    public storeMap: StorageMap = new Map<Function, StorageMapValue>();

    /**
     * 获取最终的配置
     * @param method method的函数
     * @param instance class的实例
     * @param defaultConfig 默认值
     * @param argumentsObj method实参
     * @param storeMap 存储
     * @returns
     */
    getMethodMergedConfig(
        method: Function,
        instance: Object,
        defaultConfig: RequestConfig = {},
        argumentsObj: ArrayLike<any>
    ) {
        if (!isObject(method) && !isFunction(method) && !isAsyncFunction(method)) {
            throw new Error(
                "methodFunction must be a/an Object|Function|AsyncFunction"
            );
        }
        const { storeMap } = this;
        const _class_ = instance.constructor;
        const config: StorageMapValue = storeMap.get(_class_) || new Map();
        // 挂载class身上的config
        const classConfig = config.get(STORE_KEYS.classConfig) || {};

        // 方法上的config
        const methodConfig =
            (config.get("methods") as StorageMapValue.MethodsMap).get(method) || {};

        // 实例
        const instances: StorageMapValue.InstancesMap =
            (config.get(STORE_KEYS.instances) as StorageMapValue.InstancesMap) ||
            new Map();
        const instanceMapValue: StorageMapValue.CommonConfigValue =
            instances.get(instance) || {};

        // 实例的config属性, 支持原型上查找
        // @ts-ignore
        const instanceConfig = instance["config"] || {};

        const instancePropertyMap = instanceMapValue.fieldPropertyMap || {};
        const fieldConfig = Object.entries(instancePropertyMap).reduce(
            (obj: RequestConfig, [key, value]) => {
                if (hasOwnProperty(instance, value)) {
                    // @ts-ignore
                    obj[key] = getOwnProperty(instance, value);
                }
                return obj;
            },
            {}
        );

        let mConfig: RequestConfig = merge(
            {},
            // 自定义默认config
            defaultConfig,
            // class上的config
            classConfig,
            // 实例 config 属性的值
            instanceConfig,
            // class filed map后组成的config
            fieldConfig,
            // method 上的config
            methodConfig.config || {}
        );

        mConfig = this.adjustConfig(mConfig, argumentsObj, methodConfig);

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
    getStaticMethodMergedConfig(
        method: Function,
        _class_: Function,
        defaultConfig: RequestConfig = {},
        argumentsObj: ArrayLike<any>
    ) {
        if (!isObject(method) && !isFunction(method) && !isAsyncFunction(method)) {
            throw new Error(
                "methodFunction must be a/an Object|Function|AsyncFunction"
            );
        }
        const { storeMap } = this;
        const key = _class_;
        const config: StorageMapValue = storeMap.get(key) || new Map();
        // 挂载class身上的
        const classConfig = config.get(STORE_KEYS.classConfig) || {};
        const methodConfig: StorageMapValue.MethodConfigValue =
            (config.get("staticMethods") as StorageMapValue.MethodsMap).get(
                method
            ) || {};

        const commonConfig: StorageMapValue.CommonConfigValue =
            (config.get(
                STORE_KEYS.staticConfig
            ) as StorageMapValue.CommonConfigValue) || {};

        // 静态属性 config 会被读取为配置
        const staticConfig = getOwnProperty(_class_, "config", {});

        // 静态属性映射
        const staticPropertyMap = commonConfig.fieldPropertyMap || {};
        // 映射组合成为 config
        const staticFiledConfig = Object.entries(staticPropertyMap).reduce(
            (obj: RequestConfig, [key, value]) => {
                if (hasOwnProperty(_class_, value)) {
                    // @ts-ignore
                    obj[key] = getOwnProperty(_class_, value);
                }
                return obj;
            },
            {}
        );

        let mConfig: RequestConfig = merge(
            {},
            // 初始化默认值
            defaultConfig,
            // class装饰器上的config
            classConfig,
            // 静态属性 config
            staticConfig,
            // class 静态field 映射后的 config
            staticFiledConfig,
            // method 上配置的默认值
            methodConfig.config || {}
        );

        mConfig = this.adjustConfig(mConfig, argumentsObj, methodConfig);

        return mConfig;
    }

    private getDefaultParamsOptions(
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

    private adjustConfig(
        mConfig: RequestConfig,
        argumentsObj: ArrayLike<any>,
        methodConfig: StorageMapValue.MethodConfigValue
    ): RequestConfig<any> {
        let argLength = argumentsObj.length;
        let { config, ...userOptions }: StorageMapValue.MethodConfigValue =
            methodConfig;

        const defaultOptions = this.getDefaultParamsOptions(mConfig.method as Method);
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

    updateFieldConfig(
        _class_: Function,
        instance: Object | null | undefined,
        config: Record<PropertyKey, PropertyKey>
    ) {
        const { storeMap } = this;
        const instancesKey = STORE_KEYS.instances;

        const val: StorageMapValue = storeMap.get(_class_) || new Map();
        let instances: StorageMapValue.InstancesMap = val.get(
            instancesKey
        ) as StorageMapValue.InstancesMap;
        if (!instances) {
            instances = new Map();
            val.set(instancesKey, instances);
        }
        const commonConfig: StorageMapValue.CommonConfigValue =
            instances.get(instance!) || {};
        commonConfig.fieldPropertyMap = commonConfig.fieldPropertyMap || {};
        Object.assign(commonConfig.fieldPropertyMap, config);
        instances.set(instance!, commonConfig);
        storeMap.set(_class_, val);
    }

    updateStaticFieldConfig(
        _class_: Function,
        _instance: Object | null | undefined,
        mapConfig: Record<PropertyKey, PropertyKey>
    ) {
        const { storeMap } = this;
        const staticConfigKey = STORE_KEYS.staticConfig;

        const val: StorageMapValue = storeMap.get(_class_) || new Map();
        let commonConfig: StorageMapValue.CommonConfigValue =
            val.get(staticConfigKey) as StorageMapValue.CommonConfigValue || {};

        commonConfig.fieldPropertyMap = commonConfig.fieldPropertyMap || {};
        Object.assign(commonConfig.fieldPropertyMap, mapConfig);
        val.set(staticConfigKey, commonConfig);
        storeMap.set(_class_, val);
    }

    updateMethodConfig(
        _class_: Function,
        method: Function,
        config: StorageMapValue.MethodConfigValue
    ) {
        this.innerUpdateStaticMethodConfig(_class_, method, config, "methods");
    }

    updateStaticMethodConfig(
        _class_: Function,
        method: Function,
        config: StorageMapValue.MethodConfigValue
    ) {
        this.innerUpdateStaticMethodConfig(
            _class_,
            method,
            config,
            "staticMethods"
        );
    }

    private innerUpdateStaticMethodConfig(
        _class_: Function,
        method: Function,
        config: StorageMapValue.MethodConfigValue,
        key: "methods" | "staticMethods"
    ) {
        const { storeMap } = this;
        const val: StorageMapValue = storeMap.get(_class_) || new Map();
        let methodsMapValue: StorageMapValue.MethodsMap = val.get(
            key
        ) as StorageMapValue.MethodsMap;
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

    updateClassConfig(_class_: Function, config: StorageMapValue.ConfigValue) {
        const { storeMap } = this;
        const val: StorageMapValue = storeMap.get(_class_) || new Map();
        val.set(STORE_KEYS.classConfig, config);
        storeMap.set(_class_, val);
    }

}