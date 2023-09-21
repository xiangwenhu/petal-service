import { CreateDecoratorOptions, StorageMap, StorageMapValue } from "../other.type";
import { RequestConfig } from "../types";

function updateFiledConfig(
    storeMap: StorageMap,
    key: Function,
    instance: Object,
    config: any
) {
    const val: StorageMapValue = (storeMap.get(key) || new Map());
    let instances: StorageMapValue.InstancesMapValue = val.get("instances");
    if (!instances) {
        instances = new Map();
        val.set("instances", instances);
    }
    const oldConfig: StorageMapValue.InstanceValue = instances.get(instance) || {};
    Object.assign(oldConfig, config);
    instances.set(instance, oldConfig);
    storeMap.set(key, val);
}

export function createFieldDecorator({
    storeMap,
}: CreateDecoratorOptions) {
    return function fieldDecorator(field: keyof RequestConfig) {
        // target 为 undefined
        return function (target: any, context: ClassFieldDecoratorContext<Object>) {
            context.addInitializer(function () {
                // this 是实例对象, this.constructor 是 class
                const instance = this;
                const key = instance.constructor;
                console.log(`fieldDecorator class:${key.name}, filed:${String(context.name)}`);

                updateFiledConfig(storeMap, key, instance, {
                    [field]: context.name
                })
            })
        }
    }
}