import { IDataStore } from "./dataStore.type";
import { RequestConfig, RequestInstance } from "./types";

export type StorageMapValueKey =
    | "classConfig"
    | "methods"
    | "instances"
    | "staticConfig"
    | "staticMethods";

export type StorageMapValue = Map<
    StorageMapValueKey,
    | StorageMapValue.ConfigValue // classConfig
    | StorageMapValue.MethodsMap // methods staticMethods
    | StorageMapValue.InstancesMap // instances
    | StorageMapValue.CommonConfigValue // staticConfig
>;

export namespace StorageMapValue {
    export type ConfigValue = Partial<RequestConfig>;
    export type MethodsMap = Map<Function, MethodConfigValue>;
    export type MethodConfigValue = {
        config?: ConfigValue;
    } & MethodParamsOptions;
    export interface MethodParamsOptions {
        hasParams?: boolean;
        hasBody?: boolean;
        hasConfig?: boolean;
    }
    export type InstancesMap = Map<Object, CommonConfigValue>;
    export type CommonConfigValue = {
        config?: ConfigValue,
        fieldPropertyMap?: FieldPropertyMapValue;
    };
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

/**
 * 更新方法的请求配置
 */
interface UpdateMethodConfig {
    (
        /**
         * class
         */
        _class_: Function,
        /**
         * method 函数
         */
        method: Function,
        config: StorageMapValue.MethodConfigValue
    ): void;
}

/**
 * 更新字段映射配置
 */
interface UpdateFieldConfig {
    (
        /**
         * class
         */
        _class_: Function,
        /**
         * class 实例, 如果是静态字段，该值无意义
         */
        instance: Object | null | undefined,
        config: Record<PropertyKey, PropertyKey>
    ): void;
}

export interface CreateDecoratorOptions {
    /**
     * 存储
     */
    dataStore: IDataStore;
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
 * method 参数配置
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
