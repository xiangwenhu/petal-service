import { createMap } from "./store"
import { CreateDecoratorOptions, ServiceRootConfig, StorageMapValue } from "./other.type";
import { RequestConfig } from "./types";
import { createClassDecorator } from "./decorator/class";
import { DEFAULT_CONFIG } from "./decorator/const";
import { createCommonFieldDecorator } from "./decorator/field";
import { createApiDecorator, createMiscellaneousDecorator } from "./decorator/method";
import axios from "axios";

/**
 * 更新配置
 * @param options 
 * @param config 
 */
function setConfig(options: CreateDecoratorOptions, config: RequestConfig) {
    const oldConfig = options.defaults || {};
    Object.assign(oldConfig, config);
}


export function createServiceInstance(config: ServiceRootConfig = {}) {
    const storeMap = createMap<Function, StorageMapValue>();
    const options: CreateDecoratorOptions = {
        storeMap,
        defaults: config.defaults || DEFAULT_CONFIG,
        request: config.request || axios.create() as any,
    };

    return {
        /**
         * class 装饰器
         */
        classDecorator: createClassDecorator(options),
        /**
         * api 装饰器
         */
        apiDecorator: createApiDecorator(options),
        /**
         * api 杂项装饰器
         */
        apiMiscellaneousDecorator: createMiscellaneousDecorator(options),
        /**
         * 通用字段装饰器
         */
        commonFieldDecorator: createCommonFieldDecorator(options),
        /**
         * 更新配置，用户动态设置授权信息等，例如jwt
         * @param config
         * @returns
         */
        setConfig: (config: RequestConfig) => setConfig(options, config),
    }
}