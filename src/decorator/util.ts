import { RequestConfig, RequestInstance } from "../types";

export function proxyRequest({
    method,
    config,
    request,
    proxyObject
}: {
    method: Function,
    config: RequestConfig,
    request: RequestInstance,
    proxyObject: Object
}){
    return request!(config as any).then((res) => {
        // 代理 classInstance, 即方法实例
        const proxy = new Proxy(proxyObject, {
            get: function (target, property, receiver) {
                if (property == "res") {
                    return res;
                }
                return Reflect.get(target, property, receiver);
            },
        });
        return method.call(proxy).then((resData: any) => {
            // api method方法里面可以什么都不写，直接返回结果
            if (resData === undefined) {
                return res.data;
            }
            return resData;
        });
    });
}