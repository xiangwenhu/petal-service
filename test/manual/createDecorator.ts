import {
    classDecorator,
    createDecorator,
    methodDecorator,
    enableLog
} from "../../src";
import { ApiResponse, RequestConfig } from "../../src/types";

enableLog();
/**
 * 通过field自定义headers
 */
const headersDecorator = createDecorator(({ dataStore }) => {
    return function (target: any, context: ClassFieldDecoratorContext<Function>) {
        context.addInitializer(function () {
            // this 是实例对象, this.constructor 是 class, target 为 undefined
            const instance = this;
            const _class_ = instance.constructor;
            dataStore.updateFieldConfig(_class_, instance, {
                headers: context.name
            });
        })
    }

})

// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://www.baidu.com",
})
class DemoService<R = any> {
    protected res!: ApiResponse<R>;

    @methodDecorator({
        method: "get",
        url: "",
    })
    public async getIndex(
        this: DemoService<string>,
        _config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        return this.res.data
    }
    @headersDecorator headers = {
        "AppId": 5000
    }
}

const serviceA = new DemoService();
serviceA
    .getIndex(
        {
            headers: { secId: 'xx-xx' },
        },
    )
    .then((res) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });
