<<<<<<< HEAD
import { DEFAULT_CONFIG } from "../const";
import {
    CreateDecoratorOptions,
    ParamsDecoratorOptions
} from "../other.type";
import { RequestConfig } from "../types";
import { getBaseConfig } from "./util";

export function createApiDecorator({
    storeMap,
    defaults,
    request,
    updateAPIConfig
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
                const key = classInstance.constructor;
                console.log(`apiDecorator class:${key.name}, method:${String(context.name)}`);

                updateAPIConfig( key, target, { config });
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
                        return target.call(proxy)
                            .then((resData: any) => {  // api方法里面可以什么都不写，直接返回结果
                                if (resData === undefined) {
                                    return res.data
                                }
                                return resData;
                            });
                    })
            };
        };
    };
}

export function createParamsDecorator({
    updateAPIConfig
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

                updateAPIConfig(key, target, options);
            });
        };
    };
}
=======
import { DEFAULT_CONFIG } from "../const";
import {
    CreateDecoratorOptions,
    ParamsDecoratorOptions
} from "../other.type";
import { RequestConfig } from "../types";
import { getBaseConfig } from "./util";

export function createApiDecorator({
    storeMap,
    defaults,
    request,
    updateAPIConfig
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
                const key = classInstance.constructor;
                console.log(`apiDecorator class:${key.name}, method:${String(context.name)}`);

                updateAPIConfig( key, target, { config });
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
                        return target.call(proxy)
                            .then((resData: any) => {  // api方法里面可以什么都不写，直接返回结果
                                if (resData === undefined) {
                                    return res.data
                                }
                                return resData;
                            });
                    })
            };
        };
    };
}

export function createParamsDecorator({
    updateAPIConfig
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

                updateAPIConfig(key, target, options);
            });
        };
    };
}
>>>>>>> aaeb78001af0a875b4548097dbaf49cf1f4bb11f
