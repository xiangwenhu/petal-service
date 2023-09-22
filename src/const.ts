import { StorageMapValue } from "./other.type";
import { createMap } from "./store";
import { RequestConfig } from "./types";

export const DEFAULT_CONFIG: RequestConfig = {
    timeout: 60 * 1000,
    responseType: "json"
}

export const STORE_KEY_CONFIG = "__config__";
export const STORE_KEY_APIS = 'apis';
export const STORE_KEY_INSTANCES = 'instances';

export const STORE_KEYS  = {
    STORE_KEY_CONFIG ,
    STORE_KEY_APIS,
    STORE_KEY_INSTANCES
}

export const storeMap = createMap<Function, StorageMapValue>();