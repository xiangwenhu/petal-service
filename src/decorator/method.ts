import { DEFAULT_CONFIG, SYMBOL_ORIGIN_FUNCTION } from "../const";
import { CreateDecoratorOptions, RequestConfig } from "../types";
import { isFunction } from "../util";
import { isAsyncFunction, isNormalFunction } from "../util/function";
import { proxyRequest } from "./util";

export function createMethodDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function methodDecorator(config: RequestConfig = DEFAULT_CONFIG) {
        return function (
            target: Function,
            context: ClassMethodDecoratorContext<any>
        ) {
            if (!isNormalFunction(target) && !isAsyncFunction(target)) {
                throw new Error(`methodDecorator 只能用于装饰class的普通方法或者异步方法，当前方法名：${target?.name}`);
            }

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
    methodOwner: Object | Function,
    thisObject: Object | Function,
    creatorOptions: CreateDecoratorOptions,
    context: ClassMethodDecoratorContext<any>,
    callback: Function) {
    function proxyMethod() {
        const { defaults, dataStore, requester, logger } = creatorOptions;

        // 读取最终合并后的配置
        const config = dataStore.getMethodMergedConfig(
            thisObject,
            method,
            defaults,
            arguments.length > 0 ? arguments[0] : {}
        );

        const constructorName = isFunction(thisObject) ? (thisObject as Function).name : thisObject.constructor.name;

        logger.log(
            `${constructorName} ${method.name} final config:`,
            config
        );

        return proxyRequest({
            method,
            thisObject,
            config,
            requester,
            logger
        });
    }

    const propertyDescriptor = Object.getOwnPropertyDescriptor(thisObject, context.name);
    const oriSYMBOL = SYMBOL_ORIGIN_FUNCTION;
    const cName = isFunction(thisObject) ? (thisObject as Function).name : thisObject.constructor.name;
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
        Object.defineProperty(methodOwner, context.name, {
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

        const proto = Object.getPrototypeOf(classInstance);

        commonMethodDecorator(method, proto, classInstance, creatorOptions, context, () => {
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

        commonMethodDecorator(method, _class_, _class_, creatorOptions, context, () => {
            dataStore.updateStaticMethodConfig(_class_, method, { config });
        })

    });

}
