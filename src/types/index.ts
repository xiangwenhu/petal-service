export * from "./request";

import { IDataStore } from "./datastore";
import Logger from "./logger";
import { RequestConfig, RequestInstance } from "./request";

export interface StorageMapValue {
    classConfig?: Partial<StorageMapValue.ConfigValue>;
    methods?: Map<Function, StorageMapValue.MethodConfigValue>;
    instances?: Map<Object, StorageMapValue.CommonConfigValue>;
    staticConfig?: StorageMapValue.CommonConfigValue;
    staticMethods?: Map<Function, StorageMapValue.MethodConfigValue>;
}


export namespace StorageMapValue {
    export type ConfigValue = Partial<RequestConfig>;
    export type MethodsMap = Map<Function, MethodConfigValue>;
    export type MethodConfigValue = {
        config?: ConfigValue;
    };
    export type InstancesMap = Map<Object, CommonConfigValue>;
    export type CommonConfigValue = {
        config?: ConfigValue; // 暂时无用
        fieldPropertyMap?: FieldPropertyMapValue;
    };
    export type FieldPropertyMapValue = Record<PropertyKey, PropertyKey>;

    export type ProxiesValue = Map<Object | Function, Object | Function>;
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

    /**
     * 启用日志
     */
    enableLog?: boolean;
    /**
     * 日志对象
     */
    logger?: Logger;
}

export interface CreateDecoratorOptions {
    /**
     * 存储
     */
    dataStore: IDataStore;
    /**
     * 默认配置
     */
    defaults: RequestConfig;
    /**
     * 请求方法
     * @param config RequestConfig
     * @returns
     */
    get request(): RequestInstance;
    /**
     * 日志对象
     */
    get logger(): Logger;
}

export type InnerCreateDecoratorOptions = CreateDecoratorOptions &
    ServiceRootConfig;



export interface RequestParams<D = any, P
    = any, PP = Record<string, string | number>> {
    /**
     * path 参数，比如：  /get/:id
     */
    path: PP;
    /**
     * query 参数： 比如  get?id=10
     */
    params: P;
    /**
     * 请求
     */
    data: D;
    /**
     * 外的配置参数，主要用于设置 headers等
     */
    config: Partial<RequestConfig<D>>;
}


export namespace RequestParamsPick {

    type CommonParams<D = any> = {
        config?: Partial<RequestConfig<D>>
    }

    /**
     * path + config?
     */
    export interface Path<P = any> extends CommonParams {
        path: P;
    }

    /**
     * path + data + config?
     */
    export interface PathData<P = any, D = any> extends CommonParams<D> {
        path: P;
        data: D
    }

    /**
     * path + params + data + config?
     */
    export interface PathParamsData<P = any, Q = any, D = any> extends CommonParams<D> {
        path: P;
        query: Q;
        data: D
    }

    /**
     * params + config?
     */
    export interface Params<P = any> extends CommonParams {
        params: P;
    }

    /**
     * params + data + config?
     */
    export interface ParamsData<P = any, D = any> extends CommonParams<D> {
        query: P;
        data: D
    }

    /**
     * data + config?
     */
    export interface Data<D = any> extends CommonParams {
        data: D
    }

}

