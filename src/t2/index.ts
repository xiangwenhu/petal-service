import { createServiceRoot } from "./decorator"

const { classDecorator, apiDecorator, setConfig, apiParamsDecorator, apiBodyDecorator } = createServiceRoot();

setConfig({
    headers: {
        token: "ccccc"
    }
})

@classDecorator({
    baseURL: "https://github.com"
})
class DemoService {
    @apiDecorator({
        method: "get",
        url: "trending/javascript",
    })
    @apiParamsDecorator()
    // @apiBodyDecorator()
    async getIndex<R = string>(this: any, params: any): Promise<string> {
        return this.data
    }
}


const serviceA = new DemoService();
serviceA.getIndex({ since: "monthly" }).then(res => {
    console.log("resA:", res.length)
}).catch(err => {
    console.log("error:", err);
})

