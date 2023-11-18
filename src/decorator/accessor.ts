import { CreateDecoratorOptions } from "../types";
import { RequestConfig } from "../types";
import { isRequestConfigKey } from "./util";

export function createAccessorDecorator(
    createDecoratorOptions: CreateDecoratorOptions
) {
    return function accessorDecorator(field?: keyof RequestConfig) {
        return function (
            target: ClassAccessorDecoratorTarget<any, any>,
            context: ClassAccessorDecoratorContext<any, any>
        ) {
            // target: {get, set}
            if (context.kind !== "accessor") {
                throw new Error("accessorDecorator 只能用于装饰class的accessor");
            }
            if (context.private) {
                throw new Error(`accessorDecorator 不能用于装饰class的private accessor: ${String(context.name)}`);
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
    creatorOptions: CreateDecoratorOptions
) {
    const result: ClassAccessorDecoratorResult<any, any> = {
        get(this) {
            return target.get.call(this);
        },
        set(value: any) {
            target.set.call(this, value);
        },
        init(initialValue) {
            const { dataStore, logger } = creatorOptions;
            const instance = this;
            const _class_ = this.constructor;
            logger.log(`innerAccessorDecorator class:${_class_.name}, field:${String(
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
    creatorOptions: CreateDecoratorOptions
) {
    const result: ClassAccessorDecoratorResult<any, any> = {
        get(this) {
            return target.get.call(this);
        },
        set(value: any) {
            target.set.call(this, value);
        },
        init(initialValue) {
            const { dataStore, logger } = creatorOptions;

            const _class_ = this;
            logger.log(`innerStaticAccessorDecorator class:${_class_.name}, field:${String(
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
