import { ApiResponse, RequestParams, RequestConfig } from "../../src/types";
import createInstance from "../../src/createInstance"

const {
    classDecorator,
    methodDecorator,
    setConfig,
    fieldDecorator,
    enableLog
} = createInstance({
    defaults: {
        baseURL: "https://github.com",
        timeout: 30 * 1000
    }
});

enableLog();
// 更新配置，比如授权信息，例如jwt, cookies
setConfig({
    headers: {
        token: "token",
    },
});


// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://www.baidu.com",
    timeout: 60 * 1000
})
class DemoService<R = any> {

    protected res!: ApiResponse<R>;
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    public async getIndex(
        this: DemoService<string>,
        params: Pick<RequestParams, "params" | "config">,
    ) {
        const something = this.getSomething();
        console.log("something: ", something);
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator("timeout")
    timeoutValue = 5000;

    // 设置 实例的baseURL ，优先级: 方法 > 大于实例 > class > 默认值 
    // @fieldDecorator("baseURL")
    baseURLValue = "https://www.google.com"

    getSomething() {
        return `something - ${this.timeoutValue}`
    }
}

const serviceA = new DemoService();
serviceA
    .getIndex(
        {
            params: { since: "monthly" },
            config: {
                headers: { userId: 1 },
            }
        }
    )
    .then((res: any) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });

