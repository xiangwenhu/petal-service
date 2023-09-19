import { createMap } from "../../store";
import { RequestConfig } from "../types";

export const DEFAULT_CONFIG: RequestConfig = {
    timeout: 60 * 1000,
    responseType: "json"
}

export const CONFIG_KEY = "__config__";


export const storeMap = createMap<Function,any>()