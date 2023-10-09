import {
    classDecorator,
    methodDecorator,
    setConfig,
    fieldDecorator,
    enableLog
} from "../../src";
import { ApiResponse, RequestConfig } from "../../src/types";


enableLog();
// 更新配置，比如授权信息，例如jwt, cookies
setConfig({
    headers: {
        token: "token",
    },
});


// 设置baseUrl和超时时间
@classDecorator({
    timeout: 60 * 1000,
    baseURL: "https://www.example.com"
})
class DemoService {

    static config: RequestConfig = {
        timeout: 90 * 1000
    };

    static res: ApiResponse<any>;
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    static async getIndex(
        config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        return this.res.data
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator("timeout")
    static timeoutValue = 10 * 1000;

    // 设置 实例的baseURL ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator()
    static baseURL = "https://www.google.com"
}

DemoService
    .getIndex(
        {
            headers: { userId: 1 },
        },
    )
    .then((res: any) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });
