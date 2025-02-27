import createInstance from "../../../src/createInstance"
import { ApiResponse, RequestConfig } from "../../../src/types";

const {
    classDecorator,
    methodDecorator,
    setConfig,
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
    protected res!: ApiResponse<R>;
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    async #getIndex(
        this: DemoService<string>,
        params: any,
        config: RequestConfig,
    ) {
        // return this.res!.data
    }

    getIIndex(this: DemoService<string>,
        params: any,
        config: RequestConfig,) {
        return this.#getIndex(params, config);
    }
}

const serviceA = new DemoService();
serviceA
    .getIIndex(
        { since: "monthly" },
        {
            headers: { userId: 1 },
        },
    )
    .then((res: any) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err: any) => {
        console.log("error serviceA getIndex:", err);
    });
