import { DEFAULT_CONFIG } from "../const";
import { CreateDecoratorOptions, ParamsDecoratorOptions } from "../other.type";
import { RequestConfig } from "../types";
import { getMethodConfig, getStaticMethodConfig } from "./util";

export function createMethodDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function methodDecorator(config: RequestConfig = DEFAULT_CONFIG) {
        return function (
            target: Function,
            context: ClassMethodDecoratorContext<any>
        ) {
            const method = context.static
                ? innerStaticMethodDecorator
                : innerMethodDecorator;

            method(target, context, config, createDecoratorOptions);
        };
    };
}

function innerMethodDecorator(
    target: Function,
    context: ClassMethodDecoratorContext<any>,
    config: RequestConfig,
    { updateMethodConfig, defaults, storeMap, request }: CreateDecoratorOptions
) {
    let classInstance: Function;
    context.addInitializer(function () {
        // this: instance
        // target: method
        // context: demo {"kind":"method","name":"eat","static":false,"private":false,"access":{}}
        classInstance = this;
        const key = classInstance.constructor;
        console.log(
            `innerMethodDecorator class:${key.name}, method:${String(
                context.name
            )}`
        );

        updateMethodConfig(key, target, { config });
        // 防止被串改
        Object.defineProperty(classInstance, context.name, {
            configurable: false,
            writable: false,
            value: proxyMethod,
        });
    });

    function proxyMethod() {
        // 读取最终合并后的配置
        const config = getMethodConfig(
            target,
            classInstance,
            defaults,
            arguments,
            storeMap
        );
        console.log(
            `${classInstance.constructor.name} ${target.name} final config:`,
            config
        );

        return request!(config as any).then((res) => {
            // 代理 classInstance, 即方法实例
            const proxy = new Proxy(classInstance, {
                get: function (target, property, receiver) {
                    if (property == "res") {
                        return res;
                    }
                    return Reflect.get(target, property, receiver);
                },
            });
            return target.call(proxy).then((resData: any) => {
                // api method方法里面可以什么都不写，直接返回结果
                if (resData === undefined) {
                    return res.data;
                }
                return resData;
            });
        });
    }
}

function innerStaticMethodDecorator(
    target: Function,
    context: ClassMethodDecoratorContext<Function>,
    config: RequestConfig,
    {
        updateStaticMethodConfig,
        defaults,
        storeMap,
        request,
    }: CreateDecoratorOptions
) {
    let _class_: Function;
    context.addInitializer(function () {
        // this: class
        // target: 静态method
        // context: demo: {"kind":"method","name":"run","static":true,"private":false,"access":{}}
        _class_ = this;
        console.log(
            `innerStaticMethodDecorator class:${_class_.name}, method:${String(
                context.name
            )}`
        );

        updateStaticMethodConfig(_class_, target, { config });
        // 防止被串改
        Object.defineProperty(_class_, context.name, {
            configurable: false,
            writable: false,
            value: proxyMethod,
        });
    });

    function proxyMethod() {
        // 读取最终合并后的配置
        const config = getStaticMethodConfig(
            target,
            _class_,
            defaults,
            arguments,
            storeMap
        );
        console.log(
            `${_class_.constructor.name} ${target.name} final config:`,
            config
        );

        return request!(config as any).then((res) => {
            // 代理 classInstance, 即方法实例
            const proxy = new Proxy(_class_, {
                get: function (target, property, receiver) {
                    if (property == "res") {
                        return res;
                    }
                    return Reflect.get(target, property, receiver);
                },
            });
            return target.call(proxy).then((resData: any) => {
                // api method方法里面可以什么都不写，直接返回结果
                if (resData === undefined) {
                    return res.data;
                }
                return resData;
            });
        });
    }
}

export function createParamsDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function paramsDecorator(options: ParamsDecoratorOptions = {}) {
        // target 是class的方法
        return function (
            target: Function,
            context: ClassMethodDecoratorContext<any>
        ) {
            const method = context.static
                ? innerStaticParamsDecorator
                : innerParamsDecorator;
            method(target, context, options, createDecoratorOptions);
        };
    };
}

function innerParamsDecorator(
    target: Function,
    context: ClassMethodDecoratorContext<Function>,
    options: ParamsDecoratorOptions = {},
    { updateMethodConfig }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: instance
        // target: method
        // context: demo {"kind":"method","name":"eat","static":false,"private":false,"access":{}}
        const _class_ = this.constructor;
        console.log(
            `paramsDecorator class:${_class_.name}, method:${String(context.name)}`
        );

        updateMethodConfig(_class_, target, options);
    });
}

function innerStaticParamsDecorator(
    target: Function,
    context: ClassMethodDecoratorContext<Function>,
    options: ParamsDecoratorOptions = {},
    { updateStaticMethodConfig }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: class
        // target: 静态method
        // context: demo: {"kind":"method","name":"run","static":true,"private":false,"access":{}}
        const _class_ = this.constructor;
        console.log(
            `paramsDecorator class:${_class_.name}, method:${String(context.name)}`
        );

        updateStaticMethodConfig(_class_, target, options);
    });
}
