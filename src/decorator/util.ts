import { REQUEST_CONFIG_KEYS } from "../const";
import { RequestConfig, RequestInstance } from "../types";
import Logger from "../types/logger";

export function proxyRequest({
    method,
    config,
    request,
    proxyObject,
    logger
}: {
    method: Function,
    config: RequestConfig,
    request: RequestInstance,
    proxyObject: Object,
    logger: Logger
}) {
    return request!(config as any).then((res) => {
        // Proxy.revocable vs Proxy??
        let rProxy = Proxy.revocable(proxyObject, {
            get: function (target, property, receiver) {
                if (property == "res") {
                    return res;
                }
                return Reflect.get(target, property, receiver);
            },
        });
        return method.call(rProxy.proxy)
            .then((resData: any) => {
                try {
                    rProxy.revoke();
                    // @ts-ignore
                    rProxy = null;
                } catch (err) {
                    logger.error("proxyRequest proxy.revoke error:", err)
                }
                return resData;
            })
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