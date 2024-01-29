import { DEFAULT_CONFIG, SYMBOL_ORIGIN_FUNCTION } from "../const";
import { CreateDecoratorOptions, RequestConfig } from "../types";
import { isFunction } from "../util";
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


function commonMethodDecorator(
    method: Function,
    classOrInstance: Object | Function,
    creatorOptions: CreateDecoratorOptions,
    context: ClassMethodDecoratorContext<any>,
    callback: Function) {
    function proxyMethod() {
        const { defaults, dataStore, request, logger } = creatorOptions;

        // 读取最终合并后的配置
        const config = dataStore.getMethodMergedConfig(
            classOrInstance,
            method,
            defaults,
            arguments.length > 0 ? arguments[0] : {}
        );
        logger.log(
            `${classOrInstance.constructor.name} ${method.name} final config:`,
            config
        );

        return proxyRequest({
            method,
            thisObject: classOrInstance,
            config,
            request,
            logger
        });
    }

    const propertyDescriptor = Object.getOwnPropertyDescriptor(classOrInstance, context.name);
    const oriSYMBOL = SYMBOL_ORIGIN_FUNCTION;
    const cName = isFunction(classOrInstance) ? (classOrInstance as Function).name : classOrInstance.constructor.name;
    if (propertyDescriptor && oriSYMBOL in propertyDescriptor.value) {
        creatorOptions.logger.warn(`methodDecorator: ${cName} ${String(context.name)} 已经配置，重复配置会覆盖`);
    }

    Object.defineProperty(proxyMethod, SYMBOL_ORIGIN_FUNCTION, {
        configurable: false,
        get() {
            return method
        }
    })

    try {
        // 防止被串改
        Object.defineProperty(classOrInstance, context.name, {
            configurable: true,
            // writable: true,
            value: proxyMethod,
        });
        callback();
    } catch (err) {
        creatorOptions.logger.error("innerMethodDecorator defineProperty error:", err);
    }
}

function innerMethodDecorator(
    method: Function,
    context: ClassMethodDecoratorContext<any>,
    config: RequestConfig,
    creatorOptions: CreateDecoratorOptions
) {
    let classInstance: Function;
    context.addInitializer(function () {
        const { dataStore, logger } = creatorOptions;
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

        commonMethodDecorator(method, classInstance, creatorOptions, context, () => {
            dataStore.updateMethodConfig(_class_, method, { config });
        })

    });
}

function innerStaticMethodDecorator(
    method: Function,
    context: ClassMethodDecoratorContext<Function>,
    config: RequestConfig,
    creatorOptions: CreateDecoratorOptions
) {

    let _class_: Function;
    context.addInitializer(function () {
        const { logger, dataStore } = creatorOptions;
        // this: class
        // target: 静态method
        // context: demo: {"kind":"method","name":"run","static":true,"private":false,"access":{}}
        _class_ = this;
        logger.log(
            `innerStaticMethodDecorator class:${_class_.name}, method:${String(
                context.name
            )}`
        );

        commonMethodDecorator(method, _class_, creatorOptions, context, () => {
            dataStore.updateStaticMethodConfig(_class_, method, { config });
        })

    });

}
