import { DEFAULT_CONFIG } from "./const";
import DataStore from "./dataStore";
import { createAccessorDecorator } from "./decorator/accessor";
import { createClassDecorator } from "./decorator/class";
import { createFieldDecorator } from "./decorator/field";
import {
    createMethodDecorator,
    createParamsDecorator,
} from "./decorator/method";
import getLogger from "./logger";
import {
    CreateDecoratorOptions,
    RequestInstance,
    ServiceRootConfig,
    RequestConfig
} from "./types";
import {
    createDefaultRequestInstance,
    isAsyncFunction,
    isFunction,
} from "./util";
import merge from "lodash/merge";
/**
 * 更新配置
 * @param options
 * @param config
 */
function innerSetConfig(
    options: CreateDecoratorOptions,
    config: RequestConfig
) {
    const oldConfig = options.defaults || {};
    merge(oldConfig, config);
}

function createRequestInstance(config: ServiceRootConfig) {
    if (isFunction(config.request) || isAsyncFunction(config.request)) {
        return config.request;
    }
    if (isFunction(config.createRequest)) {
        return config.createRequest?.call(config);
    }
    return undefined;
}

/**
 * 创建服务实例
 * @param config
 * @returns
 */
export default function createInstance(config: ServiceRootConfig = {}) {
    const dataStore = new DataStore();

    let requestIns: RequestInstance | undefined = createRequestInstance(config);

    const options: CreateDecoratorOptions = {
        dataStore,
        defaults: config.defaults || DEFAULT_CONFIG,
        get request() {
            if (requestIns == undefined) {
                requestIns = createDefaultRequestInstance();
            }
            return requestIns;
        },
        get logger() {
            return config.enableLog
                ? config.logger || getLogger(config.enableLog || false)
                : getLogger(false);
        },
    };

    // const options: CreateDecoratorOptions = {
    //     dataStore,
    //     defaults: innerOptions.defaults,
    //     request: innerOptions.request,
    // };

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
         * field字段装饰器
         */
        fieldDecorator: createFieldDecorator(options),
        /**
         * accessor装饰器
         */
        accessorDecorator: createAccessorDecorator(options),
        /**
         * 更新配置，用户动态设置授权信息等，例如jwt
         * @param config
         * @returns
         */
        setConfig: (config: RequestConfig) => innerSetConfig(options, config),
        /**
         * 设置request实例
         * @param request
         */
        setRequestInstance(requestInstance: RequestInstance) {
            requestIns = requestInstance;
        },
        /**
         * 自定义装饰器
         * @param creator
         * @returns
         */
        createDecorator: (
            creator: (options: CreateDecoratorOptions) => Function
        ) => {
            return creator.call(null, options);
        },

        /**
         * 允许log
         * @param enabled 
         */
        enableLog(enabled: boolean = true) {
            config.enableLog = enabled;
        },
    };
}
