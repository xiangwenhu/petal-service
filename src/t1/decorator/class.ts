import { RequestConfig, ResponseType } from "../types";
import { CONFIG_KEY, storeMap } from "./const";

const DEFAULT_CONFIG: RequestConfig = {
    timeout: 60 * 1000,
    responseType: "json"
}

export function classDecorator(config: RequestConfig = DEFAULT_CONFIG) {
    return function (target: any, context: ClassDecoratorContext<any>) {
        console.log(":classDecorator");
        if (context.kind !== 'class') {
            return
        }
        context.addInitializer( function() {
          // this 是实例对象
          const val = (storeMap.get(this) || new Map()) as Map<any, any>;
          val.set(CONFIG_KEY, config);
          storeMap.set(this, val)
        })
    }
}