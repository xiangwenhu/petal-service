import { createServiceRoot } from "./decorator";
import { RequestConfig } from "./types";

const { classDecorator, apiDecorator, setConfig, apiMiscellaneousDecorator } =
    createServiceRoot();

setConfig({
    headers: {
        token: "ccccc",
    },
});

@classDecorator({
    baseURL: "https://www.baidu.com",
})
class DemoService {
    @apiDecorator({
        method: "get",
        url: "/docs",
    })
    @apiMiscellaneousDecorator({
        hasParams: true,
        hasConfig: true,
        hasBody: false,
    })
    public async getIndex<R = string>(
        this: any,
        params: any,
        data: any,
        config: RequestConfig
    ): Promise<string> {
        return this.data;
    }
}

@classDecorator({
    baseURL: "https://www.bing.com",
})
class SubDemoService extends DemoService{
    @apiDecorator({
        method: "get",
        url: "",
    })
    @apiMiscellaneousDecorator({
        hasParams: true,
        hasConfig: true,
        hasBody: false,
    })
    async getBingIndex<R = string>(
        this: any,
        params: any,
        data: any,
        config: RequestConfig
    ): Promise<string> {
        return this.data;
    }
}

// const serviceA = new DemoService();
// serviceA
//     .getIndex(
//         { since: "monthly" },
//         { a: 1 },
//         {
//             headers: { a: 1 },
//         }
//     )
//     .then((res) => {
//         console.log("resA:", res.length);
//     })
//     .catch((err) => {
//         console.log("error:", err);
//     });

const subService = new SubDemoService();
// subService
//     .getBingIndex(
//         { since: "monthly" },
//         { a: 1 },
//         {
//             headers: { a: 1 },
//         }
//     )
//     .then((res) => {
//         console.log("resA:", res.length);
//     })
//     .catch((err) => {
//         console.log("error:", err);
//     });

subService
    .getIndex(
        { since: "monthly" },
        { a: 1 },
        {
            headers: { a: 1 },
        }
    )
    .then((res) => {
        console.log("resA:", res.length);
    })
    .catch((err) => {
        console.log("error:", err);
    });
