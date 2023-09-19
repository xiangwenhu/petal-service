import { RequestConfig } from "../types";
import { CONFIG_KEY, DEFAULT_CONFIG, storeMap } from "./const";
import axios from "axios";

export function methodDecorator(config: RequestConfig = DEFAULT_CONFIG) {
    return function (target: Function, context: ClassMethodDecoratorContext<any>) {
        if (context.kind !== 'method') {
            return
        }
        console.log(":methodDecorator");

        let methodHost: Function;

        context.addInitializer(function () {
            // this 是实例对象, this.constructor 是 class
            methodHost = this;
            const key = this.constructor;
            const val = (storeMap.get(key) || new Map()) as Map<any, any>;
            let apis: Map<any, any> = val.get("apis");
            if (!apis) {
                apis = new Map();
                val.set("apis", apis);
            }
            apis.set(target, config)
            storeMap.set(key, val)
        })

        return function () {
            const key = methodHost.constructor;
            const config: Map<any, any> = storeMap.get(key);
            const classApiConfig = config.get(CONFIG_KEY) || {};
            const apiConfig = config.get("apis").get(target) || {};

            const fConfig = {
                ...classApiConfig,
                ...apiConfig
            };

            return axios(fConfig as any).then(res => res.data).then(data => {
                return target.call({
                    data
                })
            })
        }
    }
}