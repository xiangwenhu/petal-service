import {
    classDecorator, methodDecorator, setConfig, fieldDecorator, enableLog, getStatistics
} from "../../src";
import { ApiResponse, RequestConfig, RequestParams } from "../../src/types";

// enableLog();
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
    public async getIndex(
        this: DemoService,
        _params: Pick<RequestParams, "params" | "config">,
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
    async getBingIndex<R = string>(
        this: SubDemoService,
        _params: Pick<RequestParams, "params" | "config">,
    ): Promise<string> {
        return this.res!.data;
    }
    @fieldDecorator("timeout")
    timeoutValue = 30 * 1000;
}


const serviceA = new DemoService();
// serviceA
//     .getIndex(
//         {
//             query: { since: "monthly" },
//             config: {
//                 headers: { userId: 1 },
//             }
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
//         {
//             query: { since: "monthly" },
//             config: {
//                 headers: { a: 1 },
//             }
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
        {
            query: { since: "monthly" },
            config: {
                headers: { a: 1 },
            }
        }
    )
    .then((res) => {
        console.log("res subService getIndex :", res.length);
    })
    .catch((err) => {
        console.log("res subService getIndex  error:", err);
    });


console.log(JSON.stringify(getStatistics(), undefined, "\t"));