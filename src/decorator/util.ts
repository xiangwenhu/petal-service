import { REQUEST_CONFIG_KEYS } from "../const";
import { RequestConfig, RequestInstance } from "../types";
import Logger from "../types/logger";

export function proxyRequest({
    method,
    config,
    request,
    proxyObject,
    logger,
}: {
    method: Function;
    config: RequestConfig;
    request: RequestInstance;
    proxyObject: Object;
    logger: Logger;
}) {
    const { simulated } = config;
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
        promiseRes = request!(config as any);
    }

    return promiseRes.then((res) => {
        // 代理 classInstance, 即方法实例
        const proxy = new Proxy(proxyObject, {
            get: function (target, property, receiver) {
                if (property == "res") {
                    return res;
                }
                return Reflect.get(target, property, receiver);
            },
        });
        return Promise.resolve()
            .then(() => method.call(proxy))
            .then((resData: any) => {
                // api method方法里面可以什么都不写，直接返回结果
                if (resData === undefined) {
                    return res.data;
                }
                return resData;
            });
    });
}

export function isRequestConfigKey(key: string) {
    return REQUEST_CONFIG_KEYS.indexOf(key) >= 0;
}
