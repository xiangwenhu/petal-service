import {
    classDecorator,
    paramsDecorator,
    methodDecorator,
    enableLog,
    getMethodConfig
} from "../../src";
import { ApiResponse, RequestConfig } from "../../src/types";

enableLog();
// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://juejin.cn",
    timeout: 60 * 1000
})
class DemoService<R = any> {
    protected res!: ApiResponse<R>;

    // 设置 api 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "/course/:type",
    })
    @paramsDecorator({
        hasParams: false,
    })
    public async getIndex(
        this: DemoService<string>,
        _pathParams: Record<string, string | number>,
        _config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
        return this.res.data
    }
}

const service = new DemoService();

const config   = getMethodConfig(service,  function aaa(){});

console.log("config:", config);