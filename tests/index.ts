<<<<<<< HEAD
import Axios from "axios";
import { createServiceInstance } from "../src";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    apiDecorator,
    setConfig,
    paramsDecorator,
    fieldDecorator
} = createServiceInstance({
    request: Axios
});

setConfig({
    headers: {
        token: "ccccc",
    },
});


@classDecorator({
    baseURL: "https://www.jd.com",
})
class DemoService {

    protected res?: ApiResponse;

    @apiDecorator({
        method: "get",
        url: "",
    })
    public async getIndex<R = string>(
        this: DemoService,
        params: any,
        data: any,
        config: RequestConfig
    ) {
        return this.res!.data;
    }

    @fieldDecorator("timeout")
    timeoutValue = 1000;

    @fieldDecorator("baseURL")
    baseURLValue = "https://www.github.com"
}

@classDecorator({
    baseURL: "https://cn.bing.com/",
})
class SubDemoService extends DemoService {

    @apiDecorator({
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
        params: any,
        config: RequestConfig
    ): Promise<string> {
        return this.res!.data;
    }
    @fieldDecorator("timeout")
    timeoutValue = 30 * 1000;

    @fieldDecorator("baseURL")
    baseURLValue = "https://www.example.com"
}


const serviceA = new DemoService();
serviceA
    .getIndex(
        { since: "monthly" },
        undefined,
        {
            headers: { userId: 1 },
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
=======
import Axios from "axios";
import { createServiceInstance } from "../src";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    apiDecorator,
    setConfig,
    paramsDecorator,
    fieldDecorator
} = createServiceInstance({
    request: Axios
});

setConfig({
    headers: {
        token: "ccccc",
    },
});


@classDecorator({
    baseURL: "https://www.jd.com",
})
class DemoService {

    protected res?: ApiResponse;

    @apiDecorator({
        method: "get",
        url: "",
    })
    public async getIndex<R = string>(
        this: DemoService,
        params: any,
        data: any,
        config: RequestConfig
    ) {
        return this.res!.data;
    }

    @fieldDecorator("timeout")
    timeoutValue = 1000;

    @fieldDecorator("baseURL")
    baseURLValue = "https://www.github.com"
}

@classDecorator({
    baseURL: "https://cn.bing.com/",
})
class SubDemoService extends DemoService {

    @apiDecorator({
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
        params: any,
        config: RequestConfig
    ): Promise<string> {
        return this.res!.data;
    }
    @fieldDecorator("timeout")
    timeoutValue = 30 * 1000;

    @fieldDecorator("baseURL")
    baseURLValue = "https://www.example.com"
}


const serviceA = new DemoService();
serviceA
    .getIndex(
        { since: "monthly" },
        undefined,
        {
            headers: { userId: 1 },
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
>>>>>>> aaeb78001af0a875b4548097dbaf49cf1f4bb11f
