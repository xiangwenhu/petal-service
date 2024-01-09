import { DEFAULT_CONFIG, SYMBOL_ORIGIN_FUNCTION } from "../const";
import { CreateDecoratorOptions, RequestConfig } from "../types";
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

        dataStore.updateMethodConfig(_class_, method, { config });

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
        const { defaults, dataStore, request, logger } = creatorOptions;

        // 读取最终合并后的配置
        const config = dataStore.getMethodMergedConfig(
            classInstance,
            method,
            defaults,
            arguments.length > 0 ? arguments[0] : {}
        );
        logger.log(
            `${classInstance.constructor.name} ${method.name} final config:`,
            config
        );

        return proxyRequest({
            method,
            proxyObject: classInstance,
            config,
            request,
            logger
        });
    }

    Object.defineProperty(proxyMethod, SYMBOL_ORIGIN_FUNCTION, {
        configurable: false,
        get() {
            return method
        }
    })
}

function innerStaticMethodDecorator(
    method: Function,
    context: ClassMethodDecoratorContext<Function>,
    config: RequestConfig,
    creatorOptions: CreateDecoratorOptions
) {
    
    let _class_: Function;
    context.addInitializer(function () {
        const { logger, dataStore} = creatorOptions;
        // this: class
        // target: 静态method
        // context: demo: {"kind":"method","name":"run","static":true,"private":false,"access":{}}
        _class_ = this;
        logger.log(
            `innerStaticMethodDecorator class:${_class_.name}, method:${String(
                context.name
            )}`
        );

        dataStore.updateStaticMethodConfig(_class_, method, { config });

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
        const { logger, dataStore, defaults, request} = creatorOptions;
        // 读取最终合并后的配置
        const config = dataStore.getMethodMergedConfig(
            _class_,
            method,
            defaults,
            arguments.length > 0 ? arguments[0] : {}
        );
        logger.log(
            `${_class_.constructor.name} ${method.name} final config:`,
            config
        );

        return proxyRequest({
            method: method,
            proxyObject: _class_,
            config,
            request,
            logger
        });
    }

    Object.defineProperty(proxyMethod, SYMBOL_ORIGIN_FUNCTION, {
        configurable: false,
        get() {
            return method
        }
    })
}
