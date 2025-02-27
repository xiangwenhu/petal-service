import createInstance from "../../src/createInstance";
import { ApiResponse, RequestConfig } from "../../src/types";
import { RequestParamsPick } from './../../src/types/index';

const {
    classDecorator,
    methodDecorator,
    setConfig,
    fieldDecorator,
    enableLog
} = createInstance({
    defaults: {
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
    timeout: 60 * 1000,
})
class DemoService<R = any> {

    private config: RequestConfig = {
        timeout: 90 * 1000
    };

    protected res!: ApiResponse<R>;
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    public async getIndex(
        this: DemoService<string>,
        _params: RequestParamsPick.Params<{
            since: string
        }>,
    ) {
    }

    // 设置 实例的baseURL ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator("baseURL")
    baseURLValue = "https://www.google.com"
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
