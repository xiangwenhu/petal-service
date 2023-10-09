import { CreateDecoratorOptions } from "../types";
import { RequestConfig } from "../types";
import { isRequestConfigKey } from "./util";

export function createGetterDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function getterDecorator(field?: keyof RequestConfig) {
        return function (
            target: Function,
            context: ClassGetterDecoratorContext
        ) {
            // target: getter 函数
            if (context.kind !== "getter") {
                throw new Error("getterDecorator 只能用于装饰class的getter");
            }

            const sName = `${String(context.name)}`
            if (!field && !isRequestConfigKey(sName)) {
                throw new Error("getterDecorator getter方法名 不是有效的键");
            }

            const method = context.static
                ? innerStaticGetterDecorator
                : innerGetterDecorator;

            method(target, context, (field || sName) as any, createDecoratorOptions);
        };
    };
}

function innerGetterDecorator(
    _target: Function,
    context: ClassGetterDecoratorContext<Object>,
    field: keyof RequestConfig,
    { dataStore, logger }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: class instance
        // target:  getter 函数
        // context: demo {"kind":"getter","name":"name","static":false,"private":false,"access":{}}
        const instance = this;
        const _class_ = instance.constructor;
        logger.log(
            `innerGetterDecorator class:${_class_.name}, filed:${String(
                context.name
            )}`
        );

        dataStore.updateFieldConfig(_class_, instance, {
            [field]: context.name,
        });
    });
}

function innerStaticGetterDecorator(
    _target: Function,
    context: ClassGetterDecoratorContext<Function>,
    field: keyof RequestConfig,
    { dataStore, logger }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this：class
        // target：getter 函数
        // context: demo {"kind":"field","name":"age","static":true,"private":false,"access":{}}
        const _class_ = this;
        logger.log(
            `innerStaticGetterDecorator class:${_class_.name}, filed:${String(
                context.name
            )}`
        );

        dataStore.updateStaticFieldConfig(_class_, undefined, {
            [field]: context.name,
        });
    });
}
