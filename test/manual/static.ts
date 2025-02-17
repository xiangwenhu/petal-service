import "../../src/index"
import createInstance from "../../src/createInstance"
import { ApiResponse, } from "../../src/types";

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
        _params: PetalParamsPick.Path<{
            type: string;
        }>
    ) {
        return this.res.data;
    }

    @fieldDecorator("timeout")
    static timeoutValue = 5000;
}

DemoService
    .getCourse(
        {
            path: {
                type: "frontend"
            },
            config: {
                headers: { userId: 1 },
            }
        },
    )
    .then((res) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });
