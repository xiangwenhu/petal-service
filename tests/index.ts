import { createServiceInstance } from "../src";
import { RequestConfig } from "../src/types";

const {
    classDecorator,
    apiDecorator,
    setConfig,
    apiMiscellaneousDecorator,
    commonFieldDecorator
} = createServiceInstance();

setConfig({
    headers: {
        token: "ccccc",
    },
});

@classDecorator({
    baseURL: "https://www.youtube.com",
})
class DemoService {
    @apiDecorator({
        method: "get",
        url: "",
    })
    public async getIndex<R = string>(
        this: any,
        params: any,
        data: any,
        config: RequestConfig
    ): Promise<string> {
        return this.data;
    }

    @commonFieldDecorator("timeout")
    timeoutValue = 1000;

    @commonFieldDecorator("baseURL")
    baseURLValue = "https://www.github.com"
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
        config: RequestConfig
    ): Promise<string> {
        return this.data;
    }
    @commonFieldDecorator("timeout")
    timeoutValue = 3000;

    @commonFieldDecorator("baseURL")
    baseURLValue = "https://www.baidu.com"
}


const serviceA = new DemoService();
serviceA
    .getIndex(
        { since: "monthly" },
        { a: 1 },
        {
            headers: { a: 1 },
        }
    )
    .then((res) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });

const subService = new SubDemoService();
subService
    .getBingIndex(
        { since: "monthly" },
        {
            headers: { a: 1 },
        }
    )
    .then((res) => {
        console.log("res subService getBingIndex:", res.length);
    })
    .catch((err) => {
        console.log("res subService getBingIndex error:", err);
    });

subService
    .getIndex(
        { since: "monthly" },
        { a: 1 },
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
