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
    createAxiosInstance,
    getProperty,
    isAsyncFunction,
    isFunction,
} from "./util";

import Statistics from "./dataStore/statistics";
import Logger from "./types/logger";


function initRequester(config: ServiceRootConfig) {
    if (isFunction(config.requester) || isAsyncFunction(config.requester)) {
        return config.requester;
    }
    if (isFunction(config.createRequester)) {
        return config.createRequester?.call(config);
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

    let requester: RequestInstance | undefined = initRequester(config);

    let defaultsValue = config.defaults || {};

    const options: CreateDecoratorOptions = {
        dataStore,
        get defaults() {
            return defaultsValue
        },
        get requester() {
            // 未定义，创建默认实例
            if (requester == undefined) {
                requester = createAxiosInstance(defaultsValue);
            }
            return requester;
        },
        get logger() {
            return config.enableLog
                ? config.logger || getLogger(config.enableLog || false)
                : getLogger(false);
        },
    };

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
         * 获得配置
         * @returns
         */
        getConfig() {
            return defaultsValue;
        },
        getRequester() {
            return options.requester;
        },
        setRequester(val: RequestInstance){
            requester = val;
        },
        getLogger(){
            return options.logger
        },
        setLogger(val: Logger){
            config.logger  = val
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
