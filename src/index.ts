import { createMap } from "./store"
import { CreateDecoratorOptions, InnerCreateDecoratorOptions, ServiceRootConfig, StorageMapValue } from "./other.type";
import { RequestConfig } from "./types";
import { createClassDecorator } from "./decorator/class";
import { DEFAULT_CONFIG } from "./const";
import { createFieldDecorator } from "./decorator/field";
import { createApiDecorator, createParamsDecorator } from "./decorator/method";
import { createRequestInstance, isAsyncFunction, isFunction } from "./util";
import { updateAPIConfig, updateFiledConfig } from "./decorator/util";
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
    const storeMap = createMap<Function, StorageMapValue>();

    const innerOptions: InnerCreateDecoratorOptions = {
        storeMap,
        defaults: config.defaults || DEFAULT_CONFIG,
        request: getRequestInstance(config)!,
        updateAPIConfig(_class_, api, config) {
            updateAPIConfig(storeMap, _class_, api, config);
        },
        updateFiledConfig(_class_, instance, config) {
            updateFiledConfig(storeMap, _class_, instance, config);
        },
    };

    const options: CreateDecoratorOptions = {
        storeMap,
        defaults: innerOptions.defaults,
        updateAPIConfig: innerOptions.updateAPIConfig,
        updateFiledConfig: innerOptions.updateFiledConfig,
        request: innerOptions.request
    }

    return {
        /**
         * class装饰器
         */
        classDecorator: createClassDecorator(options),
        /**
         * api装饰器
         */
        apiDecorator: createApiDecorator(options),
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