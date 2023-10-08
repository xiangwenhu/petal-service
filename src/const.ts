import { StorageMapValue, StorageMapValueKey } from "./types";
import { Method, RequestConfig } from "./types/request";

export const DEFAULT_CONFIG: RequestConfig = {
    timeout: 60 * 1000,
    responseType: "json"
}

export const storeMap = new Map<Function, StorageMapValue>();

export const STORE_KEYS: Record<StorageMapValueKey, StorageMapValueKey> = {
    "classConfig": "classConfig",
    "instances": "instances",
    "methods": "methods",
    "staticConfig": "staticConfig",
    "staticMethods": "staticMethods",
}

export const NOT_USE_BODY_METHODS: Method[] = ["get", "head", "GET", "HEAD"];

/**
 * https://axios-http.com/docs/req_config
 */
export const REQUEST_CONFIG_KEYS = [
    "url",
    "method",
    "baseURL",
    "transformRequest",
    "transformResponse",
    "headers",
    "params",
    "paramsSerializer",
    "data",
    "timeout",
    "withCredentials",
    "adapter",
    "auth",
    "responseType",
    "responseEncoding",
    "xsrfCookieName",
    "xsrfHeaderName",
    "onUploadProgress",
    "onDownloadProgress",
    "maxContentLength",
    "maxBodyLength",
    "validateStatus",
    "maxRedirects",
    "socketPath",
    "httpAgent",
    "httpsAgent",
    "proxy",
    "cancelToken",
    "decompress"
];

