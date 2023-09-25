import { DEFAULT_CONFIG } from "./const";
import DataStore from "./dataStore";
import { createClassDecorator } from "./decorator/class";
import { createFieldDecorator } from "./decorator/field";
import { createMethodDecorator, createParamsDecorator } from "./decorator/method";
import { CreateDecoratorOptions, InnerCreateDecoratorOptions, ServiceRootConfig } from "./other.type";
import { RequestConfig } from "./types";
import { createRequestInstance, isAsyncFunction, isFunction } from "./util";
;
/**
 * 更新配置
 * @param options 
 * @param config 
 */
function setConfig(options: CreateDecoratorOptions, config: RequestConfig) {
    const oldConfig = options.defaults || {};
    Object.assign(oldConfig, config);
}

function getRequestInstance(config: ServiceRootConfig) {
    if (isFunction(config.request) || isAsyncFunction(config.request)) {
        return config.request;
    }
    if (isFunction(config.createRequest)) {
        return config.createRequest?.call(config)
    }
    return createRequestInstance();
}


export function createServiceInstance(config: ServiceRootConfig = {}) {
    const dataStore = new DataStore();
    const innerOptions: InnerCreateDecoratorOptions = {
        dataStore,
        defaults: config.defaults || DEFAULT_CONFIG,
        request: getRequestInstance(config)!
    };

    const options: CreateDecoratorOptions = {
        dataStore,
        defaults: innerOptions.defaults,
        request: innerOptions.request
    }

    return {
        /**
         * class装饰器
         */
        classDecorator: createClassDecorator(options),
        /**
         * method装饰器
         */
        methodDecorator: createMethodDecorator(options),
        /**
         * params装饰器
         */
        paramsDecorator: createParamsDecorator(options),
        /**
         * 字段装饰器
         */
        fieldDecorator: createFieldDecorator(options),
        /**
         * 更新配置，用户动态设置授权信息等，例如jwt
         * @param config
         * @returns
         */
        setConfig: (config: RequestConfig) => setConfig(options, config),
        /**
         * 自定义装饰器
         * @param creator 
         * @returns 
         */
        createDecorator: (creator: (options: CreateDecoratorOptions) => Function) => {
            return creator.call(null, options)
        }
    }
}

export { BaseService } from "./BaseService";

