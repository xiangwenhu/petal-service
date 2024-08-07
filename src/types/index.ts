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
     * 网络请求者
     */
    requester?: RequestInstance;
    /**
     * 创建网络请求者 
     */
    createRequester?: () => RequestInstance;
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
    get requester(): RequestInstance;
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

    /**
     * config 即 axios 请求的整个配置
     */
    export type Native<D = any> = {
        config?: Partial<RequestConfig<D>>
    }

    /**
     * path +  config? ,
     * path 示例  /del/:id， id即为path参数 ,
     * config 即 axios 请求的整个配置
     */
    export interface Path<P = any> extends Native {
        path: P;
    }

    /**
     * path + data + config? ,
     * path 示例  /del/:id， id即为path参数 ,
     * data   即 axios 请求的配置中的 data ,
     * config 即 axios 请求的整个配置
     */
    export interface PathData<P = any, D = any> extends Native<D> {
        path: P;
        data: D
    }


    /**
     * path + params +  config? ,
     * path 示例  /del/:id， id即为path参数 ,
     * params 即 axios 请求配置中的 params ,
     * config 即 axios 请求的整个配置
     */
    export interface PathParams<P = any, PP = any> extends Native<any> {
        path: P,
        params: PP
    }

    /**
     * path + params + data + config? ,
     * path 示例  /del/:id， id即为path参数 ,
     * params 即 axios 请求配置中的 params ,
     * data   即 axios 请求的配置中的 data ,
     * config 即 axios 请求的整个配置
     */
    export interface PathParamsData<P = any, PP = any, D = any> extends Native<D> {
        path: P;
        params: PP;
        data: D
    }
    /**
     * params +  config? ,
     * params 即 axios 请求配置中的 params ,
     * config 即 axios 请求的整个配置
     */
    export interface Params<P = any> extends Native {
        params: P;
    }

    /**
     * params + data + config? ,
     * params 即 axios 请求配置中的 params ,
     * config 即 axios 请求的整个配置
     */
    export interface ParamsData<P = any, D = any> extends Native<D> {
        params: P;
        data: D
    }
    /**
     * data + config? ,
     * data   即 axios 请求的配置中的 data ,
     * config 即 axios 请求的整个配置
     */
    export interface Data<D = any> extends Native {
        data: D
    }

}

