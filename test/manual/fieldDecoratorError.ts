import {
    classDecorator,
    enableLog,
    fieldDecorator,
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

    // @ts-ignore
    @fieldDecorator({
        method: "get",
        url: "/course/:type",
    })
    getIndexGenerator = function* getIndexGenerator(
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