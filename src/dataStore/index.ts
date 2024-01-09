import { NOT_USE_BODY_METHODS } from "../const";
import { merge } from "../lib/merge";
import { Method, RequestParams, RequestConfig, StorageMap, StorageMapValue } from "../types";
import {
    getProperty,
    hasOwnProperty,
    isAsyncFunction,
    isFunction,
    isObject
} from "../util";
import { hasPathParams, pathToUrl } from "../util/path";

function shouldUseBody(method: Method) {
    if (method == null) {
        return true;
    }
    return !NOT_USE_BODY_METHODS.includes(method.toLowerCase() as Method);
}

export default class DataStore {
    public storeMap: StorageMap = new Map<Function, StorageMapValue>();

    /**
     * 获取挂载的配置，不包括创建实例的配置
     * @param method
     * @param classOrInstance
     * @returns
     */
    getMountConfigs(classOrInstance: Object | Function, method: Function) {
        // 如果instanceOrClass是class, 可以任务method是静态方法
        // 反之，是实例属性
        const isStatic = isFunction(classOrInstance);

        const { storeMap } = this;
        const _class_: Function = isStatic
            ? (classOrInstance as Function)
            : classOrInstance.constructor;
        const rootConfig: StorageMapValue = storeMap.get(_class_) || {};

        // 挂载class身上的config
        const classConfig = rootConfig.classConfig || {};

        // 方法上的config
        const methodConfig =
            ((isStatic ? rootConfig.staticMethods : rootConfig.methods) ||
                new Map<Function, StorageMapValue.MethodConfigValue>()).get(method) || {};

        // 实例或者class config 属性对应着的config
        const propertyConfig = getProperty(classOrInstance, "config", {}) || {};

        // fieldConfig
        let propertyMap;
        if (isStatic) {
            const commonConfig = rootConfig.staticConfig || {};
            propertyMap = commonConfig.fieldPropertyMap || {};
        } else {
            const instancesMap = rootConfig.instances || new Map<Object, StorageMapValue.CommonConfigValue>();
            // 从示例map中查找示例对应的配置
            const commonConfig: StorageMapValue.CommonConfigValue =
                instancesMap.get(classOrInstance) || {};

            // 字段属性映射, 如果木有，会从原型上找
            propertyMap = commonConfig.fieldPropertyMap || {};
        }

        const fieldConfig = Object.entries(propertyMap).reduce(
            (obj: RequestConfig, [key, value]) => {
                // if (hasOwnProperty(instance, value)) {
                // @ts-ignore
                obj[key] = getProperty(classOrInstance, value);
                // }
                return obj;
            },
            {}
        );

        return {
            classConfig,
            methodConfig,
            propertyConfig,
            fieldConfig,
        };
    }

    /**
     * 获取最终的配置
     * @param method method的函数
     * @param instanceOrClass class的实例
     * @param defaultConfig 默认值
     * @param argumentsObj method实参
     * @returns
     */
    getMethodMergedConfig(
        instanceOrClass: Object,
        method: Function,
        defaultConfig: RequestConfig = {},
        argumentsObj: RequestParams<any>
    ) {
        if (
            !isObject(method) &&
            !isFunction(method) &&
            !isAsyncFunction(method)
        ) {
            throw new Error(
                "methodFunction must be a/an Object|Function|AsyncFunction"
            );
        }
        const mountConfigs = this.getMountConfigs(instanceOrClass, method);

        let mConfig: RequestConfig = merge([
            {},
            // 自定义默认config
            defaultConfig,
            // class上的config
            mountConfigs.classConfig,
            // 实例 config 属性的值
            mountConfigs.propertyConfig,
            // class field map后组成的config
            mountConfigs.fieldConfig,
            // method 上的config
            mountConfigs.methodConfig.config || {},
        ]);

        mConfig = this.adjustConfig(
            mConfig,
            argumentsObj,
            mountConfigs.methodConfig
        );
        return mConfig;
    }


    /**
     * 根据参数，最后调整参数
     * @param mergedConfig 被合并后的参数
     * @param argumentsObj 方法的实参
     * @param methodConfig 方法自身的config
     * @returns
     */
    private adjustConfig(
        mergedConfig: RequestConfig,
        argumentsObj: RequestParams<any>,
        methodConfig: StorageMapValue.MethodConfigValue
    ): RequestConfig<any> {

        const {
            hasBody,
            hasConfig: hasExtraConfig,
            hasParams,
            hasPath,
        } = {
            hasBody: hasOwnProperty(argumentsObj, "data"),
            hasParams: hasOwnProperty(argumentsObj, "params"),
            hasConfig: hasOwnProperty(argumentsObj, "config"),
            hasPath: hasOwnProperty(argumentsObj, "path"),
        };

        const isHavePathParams = hasPathParams(mergedConfig.url || "");

        let expectedLength = 0;

        // 有路径参数
        if (hasPath && isHavePathParams) {
            mergedConfig.url = pathToUrl(
                mergedConfig.url || "",
                argumentsObj.path!
            );
        }
        // 有请求参数
        if (hasParams) {
            expectedLength++;
            mergedConfig.params = argumentsObj.params || {}
        }

        if (hasBody) {
            mergedConfig.data = argumentsObj.data
        }

        // 额外的配置Config
        if (hasExtraConfig) {
            mergedConfig = merge([
                mergedConfig,
                argumentsObj.config || {},
            ]);

        }
        return mergedConfig;
    }

    /**
     * 更新属性映射的配置
     * @param _class_ class
     * @param instance class的实例
     * @param config 映射关系
     */
    updateFieldConfig(
        _class_: Function,
        instance: Object | null | undefined,
        config: Record<PropertyKey, PropertyKey>
    ) {
        const { storeMap } = this;

        const rootConfig: StorageMapValue | undefined = storeMap.get(_class_) || {};
        let instances: StorageMapValue.InstancesMap | undefined = rootConfig.instances;
        if (!instances) {
            instances = new Map<Object, StorageMapValue.CommonConfigValue>();
            rootConfig.instances = instances;
        }
        let commonConfig: StorageMapValue.CommonConfigValue =
            instances.get(instance!) || {};

        commonConfig.fieldPropertyMap = merge([
            commonConfig.fieldPropertyMap || {},
            config,
        ]);
        instances.set(instance!, commonConfig);
        storeMap.set(_class_, rootConfig);
    }

    /**
     * 更新属性映射的配置
     * @param _class_ class
     * @param _instance class的实例，此处值为 undefined
     * @param config 映射关系
     */
    updateStaticFieldConfig(
        _class_: Function,
        _instance: Object | null | undefined,
        mapConfig: Record<PropertyKey, PropertyKey>
    ) {
        const { storeMap } = this;

        const rootConfig: StorageMapValue = storeMap.get(_class_) || {};
        let commonConfig: StorageMapValue.CommonConfigValue = rootConfig.staticConfig ||
            {};

        commonConfig.fieldPropertyMap = merge([
            commonConfig.fieldPropertyMap || {},
            mapConfig,
        ]);
        rootConfig.staticConfig = commonConfig;
        storeMap.set(_class_, rootConfig);
    }

    /**
     * 更新方法的请求配置
     * @param _class_ class
     * @param method 方法
     * @param config 配置
     */
    updateMethodConfig(
        _class_: Function,
        method: Function,
        config: StorageMapValue.MethodConfigValue
    ) {
        this.innerUpdateStaticMethodConfig(_class_, method, config, "methods");
    }

    /**
     * 更新方法的请求配置
     * @param _class_ class
     * @param method 方法
     * @param config 配置
     */
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
        const val: StorageMapValue = storeMap.get(_class_) || {};
        let methodsMapValue: StorageMapValue.MethodsMap | undefined = val[key];
        if (!methodsMapValue) {
            methodsMapValue = new Map();
            val[key] = methodsMapValue;
        }
        let oldConfig: StorageMapValue.MethodConfigValue = methodsMapValue.get(method) || {};
        oldConfig = merge([oldConfig, config]);
        methodsMapValue.set(method, oldConfig);
        storeMap.set(_class_, val);
    }

    /**
     * 更新class的请求配置
     * @param _class_
     * @param config
     */
    updateClassConfig(_class_: Function, config: StorageMapValue.ConfigValue) {
        const { storeMap } = this;
        const val: StorageMapValue = storeMap.get(_class_) || {};
        val.classConfig = config;
        storeMap.set(_class_, val);
    }
}
