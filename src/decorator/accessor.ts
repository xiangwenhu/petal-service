import { CreateDecoratorOptions } from "../types";
import { RequestConfig } from "../types";
import { isRequestConfigKey } from "./util";

export function createAccessorDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function accessorDecorator(field?: keyof RequestConfig) {
        return function (
            target: any,
            context: ClassAccessorDecoratorContext<any, any>
        ) {
            if (context.kind !== "accessor") {
                throw new Error("accessorDecorator 只能用于装饰class的accessor");
            }

            const sName = `${String(context.name)}`
            if (!field && !isRequestConfigKey(sName)) {
                throw new Error("accessorDecorator field 不是有效的键");
            }

            const method = context.static
                ? innerStaticAccessorDecorator
                : innerAccessorDecorator;
            return method(target, context, (field || sName) as any, createDecoratorOptions);
        };
    };
}

function innerAccessorDecorator(
    target: ClassAccessorDecoratorTarget<any, any>,
    context: ClassAccessorDecoratorContext<any, any>,
    field: keyof RequestConfig,
    { dataStore, logger }: CreateDecoratorOptions
) {
    const result: ClassAccessorDecoratorResult<any, any> = {
        get(this) {
            return target.get.call(this);
        },
        set(value: any) {
            target.set.call(this, value);
        },
        init(initialValue) {
            const instance = this;
            const _class_ = this.constructor;
            logger.log(`innerFieldDecorator class:${_class_.name}, filed:${String(
                context.name
            )}`);
            dataStore.updateFieldConfig(_class_, instance, {
                [field]: context.name,
            });
            return initialValue
        },
    };
    return result;
}

function innerStaticAccessorDecorator(
    target: ClassAccessorDecoratorTarget<any, any>,
    context: ClassAccessorDecoratorContext<any, any>,
    field: keyof RequestConfig,
    { dataStore, logger }: CreateDecoratorOptions
) {
    const result: ClassAccessorDecoratorResult<any, any> = {
        get(this) {
            return target.get.call(this);
        },
        set(value: any) {
            target.set.call(this, value);
        },
        init(initialValue) {
            const _class_ = this;
            logger.log(`innerFieldDecorator class:${_class_.name}, filed:${String(
                context.name
            )}`);
            dataStore.updateStaticFieldConfig(_class_, undefined, {
                [field]: context.name,
            });
            return initialValue
        },
    };
    return result;
}
