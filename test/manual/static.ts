import createInstance from "../../src/createInstance"
import { ApiResponse, RequestConfig } from "../../src/types";

const {
    classDecorator, methodDecorator, enableLog, fieldDecorator
} = createInstance({
    defaults: {
        baseURL: "https://juejin.cn"
    }
});
enableLog();
// 设置baseUrl和超时时间
@classDecorator({
    timeout: 60 * 1000
})
class DemoService {

    static res: ApiResponse;

    @methodDecorator({
        method: "get",
        url: "/course/:type",
    })
    static async getCourse(
        this: typeof DemoService,
        _pathParams: Record<string, string | number>,
        _config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
        return this.res.data;
    }

    @fieldDecorator("timeout")
    static timeoutValue = 5000;
}

DemoService
    .getCourse(
        {
            type: "frontend"
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
