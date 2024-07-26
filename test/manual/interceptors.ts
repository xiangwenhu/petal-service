import {
    accessorDecorator,
    BaseService,
    enableLog,
    methodDecorator,
    getRequester
} from "../../src";

enableLog(false);

const requester = getRequester();
requester.interceptors.request.use((config) => {
    console.log("interceptors:", config);
    return config;
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

DemoService.getIndex()
    .then((res) => {
        console.log("res:", res.length);
    })
    .catch((err) => {
        console.log("err:", err);
    });
