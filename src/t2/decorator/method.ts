import { CreateDecoratorOptions, MiscellaneousDecoratorOptions } from "../other.type";
import { RequestConfig } from "../types";
import { DEFAULT_CONFIG } from "./const";
import { getBaseConfig } from "./util";


function updateAPIConfig(storeMap: Map<any, any>, key: Function, api: Function, config: any) {
    const val = (storeMap.get(key) || new Map()) as Map<any, any>;
    let apis: Map<any, any> = val.get("apis");
    if (!apis) {
        apis = new Map();
        val.set("apis", apis);
    }
    const oldConfig = apis.get(api) || {};
    Object.assign(oldConfig, config);
    apis.set(api, oldConfig)
    storeMap.set(key, val)
}

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
                updateAPIConfig(storeMap, key, target, { config });
            })

            return function () {
                const {
                    config,
                    hasParams,
                    hasBody,
                    hasExtraConfig
                } = getBaseConfig(target, methodHost.constructor, defaults, storeMap);

                // 有请求参数
                if (hasParams) {
                    config.params = arguments[0];
                }
                // TODO: 有body
                if (hasBody) {
                    config.data = hasParams ? arguments[1] : arguments[0]
                }

                // 额外的配置
                let fConfig = config;
                if (hasExtraConfig) {
                    fConfig = {
                        ...config,
                        ...arguments[arguments.length - 1]
                    }
                }

                return request!(fConfig as any)
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


export function createMiscellaneousDecorator({
    storeMap
}: CreateDecoratorOptions) {
    return function apiMiscellaneousDecorator(options: MiscellaneousDecoratorOptions = {}) {
        return function (target: Function, context: ClassMethodDecoratorContext<any>) {
            if (context.kind !== 'method') {
                return
            }
            console.log(":paramsDecorator");
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                const key = this.constructor;
                updateAPIConfig(storeMap, key, target, options);
            })
        }
    }
}
