import { CreateDecoratorOptions } from "../types";
import { DEFAULT_CONFIG } from "../const";
import { RequestConfig } from "../types";

export function createClassDecorator(createDecoratorOptions: CreateDecoratorOptions) {
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
            if (context.kind !== "class") {
                throw new Error("classDecorator 只能用于装饰class");
            }

            // this: class
            // target: class
            // context: demo '{"kind":"class","name":"Class的Name"}'
            createDecoratorOptions.logger.log("classDecorator:", target.name);
            context.addInitializer(function () {
                const { dataStore, logger } = createDecoratorOptions;
                const _class_ = target;
                if (dataStore.hasClassConfig(_class_)) {
                    logger.warn("classDecorator:", _class_.name, "已经配置，重复配置会覆盖");
                }
                dataStore.updateClassConfig(_class_, config);
            });
        };
    };
}
