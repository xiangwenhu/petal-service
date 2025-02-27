import { REQUEST_CONFIG_KEYS, SYMBOL_ORIGIN_FUNCTION } from "../const";
import { RequestConfig, RequestInstance } from "../types";
import Logger from "../types/logger";

export function proxyRequest({
    method,
    config,
    requester,
    thisObject,
    logger,
}: {
    method: Function;
    config: RequestConfig;
    requester: RequestInstance;
    thisObject: Object;
    logger: Logger;
}) {
    const { simulated, autoExtractData } = config;
    let promiseRes: Promise<any>;
    if (simulated === true) {
        promiseRes = Promise.resolve().then(() => {
            logger.log(
                `${config.url} request is simulated, final merged config is:`,
                config
            );
            return {
                config,
                status: 200,
                statusText: 'OK',
                headers: {},
                data: config,
            };
        })
    } else {
        promiseRes = requester!(config as any);
    }

    return promiseRes.then((res) => {
        // 代理 classInstance, 即方法实例
        const thisObjectProxy = new Proxy(thisObject, {
            get: function (target, property, receiver) {
                if (property == "res") {
                    return res;
                }
                return Reflect.get(target, property, receiver);
            },
        });
        return Promise.resolve()
            .then(() => method.call(thisObjectProxy))
            .then((resData: any) => {
                if (!!autoExtractData == true) {
                    return res.data;
                }
                return resData;
            });
    });
}

export function isRequestConfigKey(key: string) {
    return REQUEST_CONFIG_KEYS.indexOf(key) >= 0;
}
