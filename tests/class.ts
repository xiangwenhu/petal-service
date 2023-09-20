import { createServiceInstance } from "../src";
import { RequestConfig } from "../src/types";

const {
    classDecorator,
    apiDecorator,
    setConfig,
    commonFieldDecorator
} = createServiceInstance();

// 更新配置，比如授权信息，例如jwt, cookies
setConfig({
    headers: {
        token: "ccccc",
    },
});

// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://www.baidu.com",
    timeout: 60 * 1000
})
class DemoService {

    // 设置 api 请求参数，最主要的是url, params, data和额外的config
    @apiDecorator({
        method: "get",
        url: "",
    })
    public async getIndex<R = string>(
        this: any,
        params: any,
        config: RequestConfig
    ): Promise<string> {
        return this.data;
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 默认值 
    @commonFieldDecorator("timeout")
    timeoutValue = 1000;

    // 设置 实例的baseURL ，优先级: 方法 > 大于实例 > class > 默认值 
    @commonFieldDecorator("baseURL")
    baseURLValue = "https://www.google.com"
}
