import { CreateDecoratorOptions } from "../other.type";
import { RequestConfig } from "../types";
import { DEFAULT_CONFIG } from "./const";
import { getConfig } from "./util";

export function createApiDecorator({
    storeMap,
    defaults,
    request
}: CreateDecoratorOptions) {
    return function apiDecorator(config: RequestConfig = DEFAULT_CONFIG) {
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
                const oldConfig = apis.get(target) || {};
                oldConfig.config = config;
                apis.set(target, oldConfig)
                storeMap.set(key, val)
            })

            return function () {
                const {
                    config,
                    hasParams,
                    hasBody
                } = getConfig(target, methodHost.constructor, defaults, storeMap);

                // 有请求参数
                if (hasParams) {
                    config.params = arguments[0];
                }
                // TODO: 有body
                if (hasBody) {
                    config.data = hasParams ? arguments[1] : arguments[0]
                }

                return request!(config as any)
                    .then((res) => {
                        return res.data
                    })
                    .then((data) => {
                        return target.call({
                            data
                        })
                    })
            }
        }
    }

}

export function createParamsDecorator({
    storeMap,
    defaults,
    request
}: CreateDecoratorOptions) {
    return function paramsDecorator() {
        return function (target: Function, context: ClassMethodDecoratorContext<any>) {
            if (context.kind !== 'method') {
                return
            }
            console.log(":paramsDecorator");
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                const key = this.constructor;
                const val = (storeMap.get(key) || new Map()) as Map<any, any>;
                let apis: Map<any, any> = val.get("apis");
                if (!apis) {
                    apis = new Map();
                    val.set("apis", apis);
                }
                const config = apis.get(target) || {};
                config.hasParams = true;
                apis.set(target, config)
                storeMap.set(key, val)
            })
        }
    }
}

export function createBodyDecorator({
    storeMap,
    defaults,
    request
}: CreateDecoratorOptions) {
    return function bodyDecorator(config: RequestConfig = DEFAULT_CONFIG) {
        return function (target: Function, context: ClassMethodDecoratorContext<any>) {
            if (context.kind !== 'method') {
                return
            }
            console.log(":paramsDecorator");
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                const key = this.constructor;
                const val = (storeMap.get(key) || new Map()) as Map<any, any>;
                let apis: Map<any, any> = val.get("apis");
                if (!apis) {
                    apis = new Map();
                    val.set("apis", apis);
                }
                const config = apis.get(target) || {};
                config.hasBody = true;
                apis.set(target, config)
                storeMap.set(key, val)
            })
        }
    }

}