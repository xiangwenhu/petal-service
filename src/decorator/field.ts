import { CreateDecoratorOptions } from "../types";
import { RequestConfig } from "../types";
import { isRequestConfigKey } from "./util";

export function createFieldDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function fieldDecorator(field?: keyof RequestConfig) {
        return function (
            target: any,
            context: ClassFieldDecoratorContext<Object>
        ) {

            if (context.kind !== "field") {
                throw new Error("fieldDecorator 只能用于装饰class的field");
            }

            const sName = `${String(context.name)}`
            if (!field && !isRequestConfigKey(sName)) {
                throw new Error("accessorDecorator field 不是有效的键");
            }

            const method = context.static
                ? innerStaticFieldDecorator
                : innerFieldDecorator;

            method(target, context, (field || sName) as any, createDecoratorOptions);
        };
    };
}

function innerFieldDecorator(
    _target: Function,
    context: ClassFieldDecoratorContext<Function>,
    field: keyof RequestConfig,
    { dataStore, logger}: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: class instance
        // target: undefined
        // context: demo {"kind":"field","name":"name","static":false,"private":false,"access":{}}
        const instance = this;
        const _class_ = instance.constructor;
        logger.log(
            `innerFieldDecorator class:${_class_.name}, filed:${String(
                context.name
            )}`
        );

        dataStore.updateFieldConfig(_class_, instance, {
            [field]: context.name,
        });
    });
}

function innerStaticFieldDecorator(
    _target: Function,
    context: ClassFieldDecoratorContext<Function>,
    field: keyof RequestConfig,
    { dataStore, logger }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this：class
        // target： undefined
        // context: demo {"kind":"field","name":"age","static":true,"private":false,"access":{}}
        const _class_ = this;
        logger.log(
            `innerFieldDecorator class:${_class_.name}, filed:${String(
                context.name
            )}`
        );

        dataStore.updateStaticFieldConfig(_class_, undefined, {
            [field]: context.name,
        });
    });
}
