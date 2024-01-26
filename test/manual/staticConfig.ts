import {
    ApiResponse,
    RequestConfig,
    RequestParams,
    enableLog,
    fieldDecorator,
    methodDecorator,
} from "../../src";

enableLog(true);

class DemoService {
    static config: RequestConfig = {
        timeout: 90 * 1000,
        baseURL: "http://www.example.com"
    };

    static res: ApiResponse<any>;
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    static async getIndex(
        _params: PetalParamsPick.Params<{
            since:string        
        }>
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        return this.res.data
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator("timeout")
    static timeoutValue = 5000;

    // 设置 实例的baseURL ，优先级: 方法 > 大于实例 > class > 默认值 
    // @fieldDecorator("baseURL")
    static baseURLValue = "https://www.google.com"
}

DemoService
    .getIndex(
        {
            params: { since: "monthly" },
            config: {
                headers: { userId: 1 },
            }
        },
    )
    .then((res: any) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });
