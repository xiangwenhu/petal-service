import { RequestConfig, RequestInstance } from "./types";

export type StorageMapValueKey =
    | "classConfig"
    | "methods"
    | "instancesFieldPropertyMap"
    | "staticFieldPropertyMap"
    | "staticMethods";

export type StorageMapValue = Map<
    StorageMapValueKey,
    | StorageMapValue.ConfigValue // classConfig  staticConfig
    | StorageMapValue.MethodsMapValue // methods staticMethods
    | StorageMapValue.InstancesMapValue // instances
>;

export namespace StorageMapValue {
    export type ConfigValue = RequestConfig;
    export type MethodsMapValue = Map<Function, MethodConfigValue>;
    export type MethodConfigValue = {
        config?: RequestConfig;
    } & MethodParamsOptions;
    export interface MethodParamsOptions {
        hasParams?: boolean;
        hasBody?: boolean;
        hasConfig?: boolean;
    }
    export type InstancesMapValue = Map<Object, FieldPropertyMapValue>;
    export type FieldPropertyMapValue = Record<PropertyKey, PropertyKey>;
}

export type StorageMap = Map<Function, StorageMapValue>;

export interface ServiceRootConfig {
    /**
     * 默认配置
     */
    defaults?: RequestConfig;
    /**
     * 请求方法
     * @param config RequestConfig
     * @returns
     */
    request?: RequestInstance;
    /**
     * 创建re
     * @returns
     */
    createRequest?: () => RequestInstance;
}

interface UpdateMethodConfig {
    (
        /**
         * class
         */
        _class_: Function,
        /**
         * api 函数
         */
        method: Function,
        config: StorageMapValue.MethodConfigValue
    ): void;
}

interface UpdateFieldConfig {
    (
        /**
         * class
         */
        _class_: Function,
        /**
         * class 实例
         */
        instance: Object,
        config: Record<PropertyKey, PropertyKey>
    ): void;
}

export interface CreateDecoratorOptions {
    /**
     * 存储
     */
    storeMap: StorageMap;

    updateMethodConfig: UpdateMethodConfig;

    updateStaticMethodConfig: UpdateMethodConfig;

    updateFieldConfig: UpdateFieldConfig;

    updateStaticFieldConfig: UpdateFieldConfig;
    /**
     * 默认配置
     */
    defaults?: RequestConfig;
    /**
     * 请求方法
     * @param config RequestConfig
     * @returns
     */
    request: RequestInstance;
}

export type InnerCreateDecoratorOptions = CreateDecoratorOptions &
    ServiceRootConfig;

/**
 * API 方法杂项配置
 */
export interface ParamsDecoratorOptions {
    /**
     * 是否有body
     */
    hasBody?: boolean;
    /**
     * 是否有参数
     */
    hasParams?: boolean;
    /**
     * 是否有额外的配置选项
     */
    hasConfig?: boolean;
}
