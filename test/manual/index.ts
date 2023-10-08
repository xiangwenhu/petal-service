import {
    classDecorator, methodDecorator, setConfig, paramsDecorator, fieldDecorator, enableLog
} from "../../src";
import { ApiResponse, RequestConfig } from "../../src/types";

enableLog();
setConfig({
    headers: {
        token: "token",
    },
});

@classDecorator({
    baseURL: "https://www.jd.com",
})
class DemoService<R = any> {
    protected res!: ApiResponse<R>;

    @methodDecorator({
        method: "get",
        url: "",
    })
    @paramsDecorator({
        hasParams: true
    })
    public async getIndex(
        this: DemoService,
        _params: any,
        _data: any,
        _config: RequestConfig
    ) {
        return this.res.data;
    }

    @fieldDecorator("timeout")
    timeoutValue = 15 * 1000;

    // @fieldDecorator("baseURL")
    baseURLValue = "https://www.github.com"
}

@classDecorator({
    baseURL: "https://cn.bing.com/",
})
class SubDemoService extends DemoService {
    @methodDecorator({
        method: "get",
        url: "",
    })
    @paramsDecorator({
        hasParams: true,
        hasConfig: true,
        hasBody: false,
    })
    async getBingIndex<R = string>(
        this: SubDemoService,
        _params: any,
        _config: RequestConfig
    ): Promise<string> {
        return this.res!.data;
    }
    @fieldDecorator("timeout")
    timeoutValue = 30 * 1000;
}


const serviceA = new DemoService();
// serviceA
//     .getIndex(
//         { since: "monthly" },
//         undefined,
//         {
//             headers: { userId: 1 },
//         }
//     )
//     .then((res) => {
//         console.log("res serviceA getIndex:", res.length);
//     })
//     .catch((err) => {
//         console.log("error serviceA getIndex:", err);
//     });

const subService = new SubDemoService();
// subService
//     .getBingIndex(
//         { since: "monthly" },
//         {
//             headers: { a: 1 },
//         }
//     )
//     .then((res) => {
//         console.log("res subService getBingIndex:", res.length);
//     })
//     .catch((err) => {
//         console.log("res subService getBingIndex error:", err);
//     });

subService
    .getIndex(
        { since: "monthly" },
        undefined,
        {
            headers: { a: 1 },
        }
    )
    .then((res) => {
        console.log("res subService getIndex :", res.length);
    })
    .catch((err) => {
        console.log("res subService getIndex  error:", err);
    });
