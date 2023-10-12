import { DEFAULT_CONFIG } from "../const";
import { CreateDecoratorOptions, ParamsDecoratorOptions } from "../types";
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
            if (context.kind !== "method") {
                throw new Error("methodDecorator 只能用于装饰class的method");
            }
            if (context.private) {
                throw new Error(`methodDecorator 不能用于装饰class的private method: ${String(context.name)}`);
            }
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
    { defaults, dataStore, request, logger }: CreateDecoratorOptions
) {
    let classInstance: Function;
    context.addInitializer(function () {
        // this: class instance
        // target: method
        // context: demo {"kind":"method","name":"eat","static":false,"private":false,"access":{}}
        classInstance = this;
        const _class_ = classInstance.constructor;
        logger.log(
            `innerMethodDecorator class:${_class_.name}, method:${String(
                context.name
            )}`
        );

        dataStore.updateMethodConfig(_class_, target, { config });

        try {
            // 防止被串改
            Object.defineProperty(classInstance, context.name, {
                configurable: false,
                writable: false,
                value: proxyMethod,
            });
        } catch (err) {
            logger.error("innerMethodDecorator defineProperty error:", err);
        }
    });

    function proxyMethod() {
        // 读取最终合并后的配置
        const config = dataStore.getMethodMergedConfig(
            target,
            classInstance,
            defaults,
            arguments
        );
        logger.log(
            `${classInstance.constructor.name} ${target.name} final config:`,
            config
        );

        return proxyRequest({
            method: target,
            proxyObject: classInstance,
            config,
            request,
        });
    }
}

function innerStaticMethodDecorator(
    target: Function,
    context: ClassMethodDecoratorContext<Function>,
    config: RequestConfig,
    { defaults, dataStore, request, logger }: CreateDecoratorOptions
) {
    let _class_: Function;
    context.addInitializer(function () {
        // this: class
        // target: 静态method
        // context: demo: {"kind":"method","name":"run","static":true,"private":false,"access":{}}
        _class_ = this;
        logger.log(
            `innerStaticMethodDecorator class:${_class_.name}, method:${String(
                context.name
            )}`
        );

        dataStore.updateStaticMethodConfig(_class_, target, { config });

        try {
            // 防止被串改
            Object.defineProperty(_class_, context.name, {
                configurable: false,
                writable: false,
                value: proxyMethod,
            });
        } catch (err) {
            logger.error("innerStaticMethodDecorator defineProperty error:", err);
        }
    });

    function proxyMethod() {
        // 读取最终合并后的配置
        const config = dataStore.getStaticMethodMergedConfig(
            target,
            _class_,
            defaults,
            arguments
        );
        logger.log(
            `${_class_.constructor.name} ${target.name} final config:`,
            config
        );

        return proxyRequest({
            method: target,
            proxyObject: _class_,
            config,
            request,
        });
    }
}

export function createParamsDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function paramsDecorator(options: ParamsDecoratorOptions = {}) {
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
    { dataStore, logger }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: class instance
        // target: method
        // context: demo {"kind":"method","name":"eat","static":false,"private":false,"access":{}}
        const _class_ = this.constructor;
        logger.log(
            `innerParamsDecorator class:${_class_.name}, method:${String(
                context.name
            )}`
        );

        dataStore.updateMethodConfig(_class_, target, options);
    });
}

function innerStaticParamsDecorator(
    target: Function,
    context: ClassMethodDecoratorContext<Function>,
    options: ParamsDecoratorOptions = {},
    { dataStore, logger }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: class
        // target: 静态method
        // context: demo: {"kind":"method","name":"run","static":true,"private":false,"access":{}}
        const _class_ = this;
        logger.log(
            `innerStaticParamsDecorator class:${_class_.name}, method:${String(
                context.name
            )}`
        );

        dataStore.updateStaticMethodConfig(_class_, target, options);
    });
}
