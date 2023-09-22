import { CreateDecoratorOptions } from "../other.type";
import { RequestConfig } from "../types";

export function createFieldDecorator({
    updateFiledConfig
}: CreateDecoratorOptions) {
    return function fieldDecorator(field: keyof RequestConfig) {
        // target 为 undefined
        return function (target: any, context: ClassFieldDecoratorContext<Object>) {
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                const instance = this;
                const key = instance.constructor;
                console.log(`fieldDecorator class:${key.name}, filed:${String(context.name)}`);

                updateFiledConfig(key, instance, {
                    [field]: context.name
                })
            })
        }
    }
}