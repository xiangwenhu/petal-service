import { CreateDecoratorOptions, StorageMapValue } from "../other.type";
import { RequestConfig } from "../types";
import { STORE_KEY_CONFIG, DEFAULT_CONFIG } from "./const";

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
        return function (target: any, context: ClassDecoratorContext<any>) {
            console.log(":classDecorator");
            if (context.kind !== 'class') {
                return
            }
            context.addInitializer(function () {
                // this 是 class
                const key = this;
                const val: StorageMapValue = (storeMap.get(key) || new Map());
                val.set(STORE_KEY_CONFIG, config);
                storeMap.set(key, val)
            })
        }
    }
}