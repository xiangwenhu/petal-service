import { StorageMapValue, StorageMapValueKey } from "../other.type";
import { createMap } from "../store";
import { RequestConfig } from "../types";

export const DEFAULT_CONFIG: RequestConfig = {
    timeout: 60 * 1000,
    responseType: "json"
}

export const storeMap = createMap<Function, StorageMapValue>();

export const STORE_KEYS: Record<StorageMapValueKey, StorageMapValueKey> = {
    "classConfig": "classConfig",
    "instances": "instances",
    "methods": "methods",
    "staticConfig": "staticConfig",
    "staticMethods": "staticMethods",
}