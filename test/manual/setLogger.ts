import "../../src";

// 允许打印日志
petalEnableLog(true);
petalSetLogger({
    debug(...args: any[]) { 
        console.log("customLog:", ...args)
    },
    log(...args: any[]) { 
        console.log("customLog:", ...args)
    },
    info(...args: any[]) { 
        console.log("customLog:", ...args)
    },
    warn(...args: any[]) { 
        console.log("customLog:", ...args)
    },
    error(...args: any[]) { 
        console.log("customLog:", ...args)
    }
});

const logger = petalGetLogger();


// 设置baseUrl和超时时间
@petalClassDecorator({
    timeout: 60 * 1000,
    baseURL: "https://www.example.com"
})
class DemoService<R = any> extends PetalBaseService<R> {
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @petalMethodDecorator({
        method: "get",
        url: "",
    })
    async getIndex(
        this: DemoService<string>,
        _params: PetalParamsPick.Params<{ since: string }>
    ): Promise<string> {
        return this.res.data
    }
}

new DemoService().getIndex(
    {
        params: { since: "monthly" },
        config: {
            headers: { userId: 1 },
        }
    }
)
    .then((res: any) => {
        logger.log("res DemoService static getIndex:", res.length);
    })
    .catch((err) => {
        logger.log("error DemoService static getIndex:", err);
    });
