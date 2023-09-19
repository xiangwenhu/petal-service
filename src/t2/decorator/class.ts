import { CreateDecoratorOptions } from "../other.type";
import { RequestConfig } from "../types";
import { CONFIG_KEY, DEFAULT_CONFIG } from "./const";

export function createClassDecorator({ storeMap }: CreateDecoratorOptions) {
    return function classDecorator(config: RequestConfig = DEFAULT_CONFIG) {
        return function (target: any, context: ClassDecoratorContext<any>) {
            console.log(":classDecorator");
            if (context.kind !== 'class') {
                return
            }
            context.addInitializer(function () {
                // this 是 class
                const key = this;
                const val = (storeMap.get(key) || new Map()) as Map<any, any>;
                val.set(CONFIG_KEY, config);
                storeMap.set(key, val)
            })
        }
    }
}