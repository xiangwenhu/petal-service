import { CreateDecoratorOptions, StorageMapValue } from "../other.type";
import { DEFAULT_CONFIG, STORE_KEYS } from "../const";
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
        return function (
            target: Function,
            context: ClassDecoratorContext<any>
        ) {
            // this: class
            // target: class
            // context: demo '{"kind":"class","name":"Class的Name"}'
            console.log("classDecorator:", target.name);
            context.addInitializer(function () {
                const key = target;
                const val: StorageMapValue = storeMap.get(key) || new Map();
                val.set(STORE_KEYS.classConfig, config);
                storeMap.set(key, val);
            });
        };
    };
}
