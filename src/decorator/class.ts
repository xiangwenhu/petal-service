import { CreateDecoratorOptions, StorageMapValue } from "../other.type";
import { STORE_KEY_CONFIG, DEFAULT_CONFIG } from "../const";
import { RequestConfig } from "../types";

export function createClassDecorator({ storeMap }: CreateDecoratorOptions) {
    /**
     * 示例
     * @classDecorator({
     *       baseURL: "https://www.api.com",
     *  })
     * class DemoService {
     * }
     */
    return function classDecorator(config: RequestConfig = DEFAULT_CONFIG) {
        // target 是 class
        return function (target: Function, context: ClassDecoratorContext<any>) {
            console.log("classDecorator:", target.name);
            context.addInitializer(function () {
                // this 是 class
                const key = target;
                const val: StorageMapValue = (storeMap.get(key) || new Map());
                val.set(STORE_KEY_CONFIG, config);
                storeMap.set(key, val)
            })
        }
    }
}