import {
    CreateDecoratorOptions,
    ParamsDecoratorOptions,
    StorageMap,
    StorageMapValue,
} from "../other.type";
import { RequestConfig } from "../types";
import { DEFAULT_CONFIG } from "../const";
import { getBaseConfig } from "./util";

function updateAPIConfig(
    storeMap: StorageMap,
    key: Function,
    api: Function,
    config: any
) {
    const val: StorageMapValue = (storeMap.get(key) || new Map());
    let apis: StorageMapValue.APISMapValue = val.get("apis");
    if (!apis) {
        apis = new Map();
        val.set("apis", apis);
    }
    const oldConfig: StorageMapValue.APIValue = apis.get(api) || {};
    Object.assign(oldConfig, config);
    apis.set(api, oldConfig);
    storeMap.set(key, val);
}

export function createApiDecorator({
    storeMap,
    defaults,
    request,
}: CreateDecoratorOptions) {
    return function apiDecorator(config: RequestConfig = DEFAULT_CONFIG) {
        // target 是 class 的方法
        return function (
            target: Function,
            context: ClassMethodDecoratorContext<any>
        ) {
            let classInstance: Function;
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                classInstance = this;
                const key = this.constructor;
                console.log(`apiDecorator class:${key.name}, method:${String(context.name)}`);

                updateAPIConfig(storeMap, key, target, { config });
                // 防止被串改
                Object.defineProperty(classInstance, context.name, {
                    configurable: false,
                    writable: false,
                    value: proxyMethod
                })
            });

            function proxyMethod() {
                // 读取最终合并后的配置
                const config =
                    getBaseConfig(
                        target,
                        classInstance,
                        defaults,
                        arguments,
                        storeMap
                    );
                console.log(`${classInstance.constructor.name} ${target.name} final config:`, config);

                return request!(config as any)
                    .then((res) => {
                        // 代理 classInstance, 即方法实例
                        const proxy = new Proxy(classInstance, {
                            get: function (target, property, receiver) {
                                if (property == "res") {
                                    return res
                                }
                                return Reflect.get(target, property, receiver)
                            },
                        });
                        return target.call(proxy);
                    })
            };
        };
    };
}

export function createParamsDecorator({
    storeMap,
}: CreateDecoratorOptions) {
    return function paramsDecorator(
        options: ParamsDecoratorOptions = {}
    ) {
        // target 是class的方法
        return function (
            target: Function,
            context: ClassMethodDecoratorContext<any>
        ) {
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                const key = this.constructor;
                console.log(`paramsDecorator class:${key.name}, method:${String(context.name)}`);

                updateAPIConfig(storeMap, key, target, options);
            });
        };
    };
}
