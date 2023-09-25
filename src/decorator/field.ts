import { CreateDecoratorOptions } from "../other.type";
import { RequestConfig } from "../types";

export function createFieldDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function fieldDecorator(field: keyof RequestConfig) {
        return function (
            target: any,
            context: ClassFieldDecoratorContext<Object>
        ) {
            const method = context.static
                ? innerStaticFieldDecorator
                : innerFieldDecorator;
            method(target, context, field, createDecoratorOptions);
        };
    };
}

function innerFieldDecorator(
    _target: Function,
    context: ClassFieldDecoratorContext<Function>,
    field: keyof RequestConfig,
    { dataStore }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this: instance
        // target: undefined
        // context: demo {"kind":"field","name":"name","static":false,"private":false,"access":{}}
        const instance = this;
        const _class_ = instance.constructor;
        console.log(
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
    { dataStore }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this：class
        // target： undefined
        // context: demo {"kind":"field","name":"age","static":true,"private":false,"access":{}}
        const _class_ = this;
        console.log(
            `innerFieldDecorator class:${_class_.name}, filed:${String(
                context.name
            )}`
        );

        dataStore.updateStaticFieldConfig(_class_, undefined, {
            [field]: context.name,
        });
    });
}
