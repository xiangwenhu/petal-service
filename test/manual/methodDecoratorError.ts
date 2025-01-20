import {
    classDecorator,
    enableLog,
    methodDecorator
} from "../../src";
import { ApiResponse } from "../../src/types";

enableLog();
// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://juejin.cn",
    timeout: 60 * 1000
})
class DemoService<R = any> {
    protected res!: ApiResponse<R>;

    @methodDecorator({
        method: "get",
        url: "/course/:type",
    })
    public * getIndexGenerator(
        this: DemoService<string>,
        _params: PetalParamsPick.Path<{
            type: string
        }>
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
        return this.res.data
    }


    @methodDecorator({
        method: "get",
        url: "/course/:type",
    })
    async * getIndexGeneratorAyns(
        this: DemoService<string>,
        _params: PetalParamsPick.Path<{
            type: string
        }>
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
        return this.res.data
    }
}

const service = new DemoService();

console.log("config:", service);