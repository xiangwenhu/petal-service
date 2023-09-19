import { ApiResponse, RequestConfig } from "./types";

export interface StorageMapValue<K, V> {
    constructor: Function;
    // TODO:: 
    fieldMap: Map<PropertyKey, V>;

    apis: Map<Function,RequestConfig>;
}

export interface ServiceRootConfig {
    defaults?: RequestConfig,
    request?: (config: RequestConfig) => Promise<ApiResponse>;
    updateConfig?: (config: RequestConfig) => void;
}

export interface CommonCreateOptions {
    storeMap: Map<any, any>
}

export type CreateDecoratorOptions = CommonCreateOptions & {
    defaults?: RequestConfig,
    request?: (config: RequestConfig) => Promise<ApiResponse>;
    updateConfig?: (config: RequestConfig) => void;
}