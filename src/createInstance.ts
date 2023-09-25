import { DEFAULT_CONFIG } from "./const";
import DataStore from "./dataStore";
import { createClassDecorator } from "./decorator/class";
import { createFieldDecorator } from "./decorator/field";
import { createMethodDecorator, createParamsDecorator } from "./decorator/method";
import { CreateDecoratorOptions, InnerCreateDecoratorOptions, ServiceRootConfig } from "./types";
import { RequestConfig } from "./types";
import { createDefaultRequestInstance, isAsyncFunction, isFunction } from "./util";
import  merge from "lodash/merge";
;
/**
 * 更新配置
 * @param options
 * @param config
 */
function innerSetConfig(options: CreateDecoratorOptions, config: RequestConfig) {
    const oldConfig = options.defaults || {};
    merge(oldConfig, config);
}

function getDefaultRequestInstance(config: ServiceRootConfig) {
    if (isFunction(config.request) || isAsyncFunction(config.request)) {
        return config.request;
    }
    if (isFunction(config.createRequest)) {
        return config.createRequest?.call(config)
    }
    return createDefaultRequestInstance();
}

/**
 * 创建服务实例
 * @param config 
 * @returns
 */
export default function createInstance(config: ServiceRootConfig = {}) {
    const dataStore = new DataStore();
    const innerOptions: InnerCreateDecoratorOptions = {
        dataStore,
        defaults: config.defaults || DEFAULT_CONFIG,
        request: getDefaultRequestInstance(config)!
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
         * 字field段装饰器
         */
        fieldDecorator: createFieldDecorator(options),
        /**
         * 更新配置，用户动态设置授权信息等，例如jwt
         * @param config
         * @returns
         */
        setConfig: (config: RequestConfig) => innerSetConfig(options, config),
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


