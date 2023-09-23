import { CreateDecoratorOptions } from "../other.type";
import { RequestConfig } from "../types";
import { updateStaticFieldConfig } from "./util";

export function createFieldDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function fieldDecorator(field: keyof RequestConfig) {
        // target 为 undefined
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
    target: Function,
    context: ClassFieldDecoratorContext<Function>,
    field: keyof RequestConfig,
    { updateFieldConfig: updateFiledConfig }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this 是 instance
        // target undefined
        // {"kind":"field","name":"name","static":false,"private":false,"access":{}}
        const instance = this;
        const key = instance.constructor;
        console.log(
            `innerFieldDecorator class:${key.name}, filed:${String(
                context.name
            )}`
        );

        updateFiledConfig(key, instance, {
            [field]: context.name,
        });
    });
}

function innerStaticFieldDecorator(
    target: Function,
    context: ClassFieldDecoratorContext<Function>,
    field: keyof RequestConfig,
    { updateStaticFieldConfig }: CreateDecoratorOptions
) {
    context.addInitializer(function () {
        // this：class
        // target： undefined
        // context: {"kind":"field","name":"age","static":true,"private":false,"access":{}}
        const _class_ = this;
        console.log(
            `innerFieldDecorator class:${_class_.name}, filed:${String(
                context.name
            )}`
        );

        updateStaticFieldConfig(_class_, undefined as any, {
            [field]: context.name,
        });
    });
}
