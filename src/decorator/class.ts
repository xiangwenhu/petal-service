import { CreateDecoratorOptions } from "../types";
import { DEFAULT_CONFIG } from "../const";
import { RequestConfig } from "../types";

export function createClassDecorator({ dataStore, logger }: CreateDecoratorOptions) {
    /**
     * 示例
     * @classDecorator({
     *       baseURL: "https://www.api.com",
     *  })
     * class DemoService {}
     */
    return function classDecorator(config: RequestConfig = DEFAULT_CONFIG) {
        return function (
            target: Function,
            context: ClassDecoratorContext<any>
        ) {
            // this: class
            // target: class
            // context: demo '{"kind":"class","name":"Class的Name"}'
            logger.log("classDecorator:", target.name);
            context.addInitializer(function () {
                const _class_ = target;
                dataStore.updateClassConfig(_class_, config);
            });
        };
    };
}
