import { DEFAULT_CONFIG } from "../const";
import { CreateDecoratorOptions, ParamsDecoratorOptions } from "../other.type";
import { RequestConfig } from "../types";
import { proxyRequest } from "./util";

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
    { defaults, dataStore, request }: CreateDecoratorOptions
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

        dataStore.updateMethodConfig(key, target, { config });
        // 防止被串改
        Object.defineProperty(classInstance, context.name, {
            configurable: false,
            writable: false,
            value: proxyMethod,
        });
    });

    function proxyMethod() {
        // 读取最终合并后的配置
        const config = dataStore.getMethodMergedConfig(
            target,
            classInstance,
            defaults,
            arguments,
        );
        console.log(
            `${classInstance.constructor.name} ${target.name} final config:`,
            config
        );

        return proxyRequest({
            method: target,
            proxyObject: classInstance,
            config,
            request
        })
    }
}

function innerStaticMethodDecorator(
    target: Function,
    context: ClassMethodDecoratorContext<Function>,
    config: RequestConfig,
    {
        defaults,
        dataStore,
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

        dataStore.updateStaticMethodConfig(_class_, target, { config });
        // 防止被串改
        Object.defineProperty(_class_, context.name, {
            configurable: false,
            writable: false,
            value: proxyMethod,
        });
    });

    function proxyMethod() {
        // 读取最终合并后的配置
        const config = dataStore.getStaticMethodMergedConfig(
            target,
            _class_,
            defaults,
            arguments,
        );
        console.log(
            `${_class_.constructor.name} ${target.name} final config:`,
            config
        );

        return proxyRequest({
            method: target,
            proxyObject: _class_,
            config,
            request
        })
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
    { dataStore }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: instance
        // target: method
        // context: demo {"kind":"method","name":"eat","static":false,"private":false,"access":{}}
        const _class_ = this.constructor;
        console.log(
            `paramsDecorator class:${_class_.name}, method:${String(context.name)}`
        );

        dataStore.updateMethodConfig(_class_, target, options);
    });
}

function innerStaticParamsDecorator(
    target: Function,
    context: ClassMethodDecoratorContext<Function>,
    options: ParamsDecoratorOptions = {},
    { dataStore }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: class
        // target: 静态method
        // context: demo: {"kind":"method","name":"run","static":true,"private":false,"access":{}}
        const _class_ = this.constructor;
        console.log(
            `paramsDecorator class:${_class_.name}, method:${String(context.name)}`
        );

        dataStore.updateStaticMethodConfig(_class_, target, options);
    });
}
