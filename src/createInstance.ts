import { SYMBOL_ORIGIN_FUNCTION, VERSION } from "./const";
import DataStore from "./dataStore";
import { createAccessorDecorator } from "./decorator/accessor";
import { createClassDecorator } from "./decorator/class";
import { createFieldDecorator } from "./decorator/field";
import { createGetterDecorator } from "./decorator/getter";
import {
    createMethodDecorator,
} from "./decorator/method";
import { merge } from "./lib/merge";
import getLogger from "./logger";
import {
    CreateDecoratorOptions,
    RequestConfig,
    RequestInstance,
    ServiceRootConfig,
} from "./types";
import {
    createRequestInstance,
    getProperty,
    isAsyncFunction,
    isFunction,
} from "./util";

import Statistics from "./dataStore/statistics";


function initRequestInstance(config: ServiceRootConfig) {
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
    const statistics = new Statistics(dataStore.storeMap);

    let requestInstance: RequestInstance | undefined = initRequestInstance(config);

    let defaultsValue = config.defaults || {};

    const options: CreateDecoratorOptions = {
        dataStore,
        get defaults() {
            return defaultsValue
        },
        get request() {
            if (requestInstance == undefined) {
                requestInstance = createRequestInstance(defaultsValue);
            }
            return requestInstance;
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
        version: VERSION,
        /**
         * class装饰器
         */
        classDecorator: createClassDecorator(options),
        /**
         * method装饰器
         */
        methodDecorator: createMethodDecorator(options),
        /**
         * field字段装饰器
         */
        fieldDecorator: createFieldDecorator(options),
        /**
         * getter函数装饰器
         */
        getterDecorator: createGetterDecorator(options),
        /**
         * accessor装饰器
         */
        accessorDecorator: createAccessorDecorator(options),
        /**
         * 更新配置，用户动态设置授权信息等，例如jwt
         * @param config
         * @returns
         */
        setConfig: (config: RequestConfig) => {
            defaultsValue = merge([defaultsValue, config || {}])
        },
        /**
         * 设置request实例
         * @param request
         */
        setRequestInstance(
            create: (options: {
                createRequestInstance: typeof createRequestInstance;
                defaults: RequestConfig,
                instance?: RequestInstance
            }) => RequestInstance
        ) {
            requestInstance = create({
                createRequestInstance,
                defaults: options.defaults,
                instance: requestInstance
            })
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

        /**
         * 获取配置
         * @param classOrInstance
         * @param method
         * @returns
         */
        getMethodConfig(classOrInstance: Object | Function, method: Function) {
            const oriFun = getProperty(method, SYMBOL_ORIGIN_FUNCTION);
            if (!oriFun) {
                throw new Error(`方法 ${method.name} 不是通过petal-service注册的方法`);
            }
            const mountConfig = dataStore.getMountConfigs(
                classOrInstance,
                oriFun
            );
            return {
                ...mountConfig,
                defaultConfig: options.defaults,
            };
        },
        getStatistics(classOrInstance?: Object | Function | null | undefined) {
            return statistics.getStatistics(classOrInstance);
        }
    };
}
