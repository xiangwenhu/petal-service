import {
    CreateDecoratorOptions,
    ApiMiscellaneousDecoratorOptions,
    StorageMap,
    StorageMapValue,
} from "../other.type";
import { RequestConfig } from "../types";
import { DEFAULT_CONFIG } from "./const";
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
        return function (
            target: Function,
            context: ClassMethodDecoratorContext<any>
        ) {
            if (context.kind !== "method") {
                return;
            }
            console.log(":methodDecorator");
            let methodHost: Function;
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                methodHost = this;
                const key = this.constructor;
                updateAPIConfig(storeMap, key, target, { config });
            });

            return function () {
                // 读取最终合并后的配置
                const config =
                    getBaseConfig(
                        target,
                        methodHost,
                        methodHost.constructor,
                        defaults,
                        arguments,
                        storeMap
                    );
                return request!(config as any)
                    .then((res) => {
                        return target.call(res);
                    })
            };
        };
    };
}

export function createMiscellaneousDecorator({
    storeMap,
}: CreateDecoratorOptions) {
    return function apiMiscellaneousDecorator(
        options: ApiMiscellaneousDecoratorOptions = {}
    ) {
        return function (
            target: Function,
            context: ClassMethodDecoratorContext<any>
        ) {
            if (context.kind !== "method") {
                return;
            }
            console.log(":paramsDecorator");
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                const key = this.constructor;
                updateAPIConfig(storeMap, key, target, options);
            });
        };
    };
}
