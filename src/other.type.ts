import { ApiResponse, RequestConfig, RequestInstance } from "./types";

export type StorageMapValue = Map<"__config__" | "apis" | "instances", any>

export namespace StorageMapValue {
    export type ConfigValue = RequestConfig;
    export type APISMapValue = Map<Function, APIValue>;
    export type APIValue = {
        config?: RequestConfig;
        hasParams?: boolean;
        hasBody?: boolean;
        hasConfig?: boolean;
    }
    export type InstancesMapValue = Map<Object, InstanceValue>;
    export type InstanceValue = Record<PropertyKey, PropertyKey>;
}

export type StorageMap = Map<Function, StorageMapValue>;



export interface ServiceRootConfig {
    /**
     * 默认配置
     */
    defaults?: RequestConfig,
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
    createRequest?: () => RequestInstance
}

export interface CreateDecoratorOptions {
    /**
     * 存储
     */
    storeMap: StorageMap;

    updateAPIConfig: (
        /**
         * class
         */
        _class_: Function,
        /**
         * api 函数
         */
        api: Function,
        config: StorageMapValue.APIValue,
    ) => void;

    updateFiledConfig: (
        /**
         * class
         */
        _class_: Function,
        /**
         * class 实例
         */
        instance: Object,
        config: Record<PropertyKey, PropertyKey>
    ) => void,
    /**
     * 默认配置
     */
    defaults?: RequestConfig,
    /**
     * 请求方法
     * @param config RequestConfig
     * @returns 
     */
    request: RequestInstance;
}

export type InnerCreateDecoratorOptions = CreateDecoratorOptions & ServiceRootConfig;


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
    hasConfig?: boolean
}