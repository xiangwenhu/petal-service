import { createServiceInstance } from "../src";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    apiDecorator,
    setConfig,
    fieldDecorator,
    paramsDecorator
} = createServiceInstance();




// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://www.baidu.com",
    timeout: 60 * 1000
})
class DemoService {

    protected res?: ApiResponse;

    // 设置 api 请求参数，最主要的是url, params, data和额外的config
    @apiDecorator({
        method: "get",
        url: "/user/:id",
    })
    @paramsDecorator({
        hasParams: false,
    })
    public async getIndex<R = string>(
        this: DemoService,
        pathParams: Record<string, string | number>,
        config: RequestConfig,
    ): Promise<any> {
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
    }
}

const serviceA = new DemoService();
serviceA
    .getIndex(
        {
            id: 100
        },
        {
            headers: { userId: 1 },
        },
    )
    .then((res) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });
