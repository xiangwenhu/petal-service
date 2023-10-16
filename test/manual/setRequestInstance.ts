import {
    accessorDecorator,
    enableLog,
    BaseService,
    methodDecorator,
    getMethodConfig,
    setRequestInstance,
} from "../../src";

enableLog();

setRequestInstance(({ createRequestInstance, defaults }) => {
    const instance = createRequestInstance(defaults);

    instance.interceptors.request.use((config) => {
        console.log("config:", config);
        return config;
    });
    return instance;
});

class DemoService<R = any> extends BaseService<R> {
    @methodDecorator({
        url: "https://baidu.com/",
    })
    static async getIndex(): Promise<string> {
        return this.res.data;
    }

    @accessorDecorator("timeout")
    static accessor timeout: number = 20 * 1000;
}

console.log(
    "getIndex config:",
    getMethodConfig(DemoService, DemoService.getIndex)
);

DemoService.getIndex()
    .then((res) => {
        console.log("res:", res.length);
    })
    .catch((err) => {
        console.log("err:", err);
    });
