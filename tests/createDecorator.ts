import { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import { createServiceInstance } from "../src";
import { StorageMapValue } from "../src/other.type";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    createDecorator,
    methodDecorator
} = createServiceInstance({
    defaults: {
        baseURL: "https://github.com",
        timeout: 30 * 1000
    }
});

/**
 * 通过filed自定义headers
 */
const headersDecorator = createDecorator(({ storeMap, updateFieldConfig: updateFiledConfig }) => {
    // target 为 undefined
    return function (target: any, context: ClassFieldDecoratorContext<any>) {
        context.addInitializer(function () {
            // this 是实例对象, this.constructor 是 class
            const instance = this;
            const key = instance.constructor;
            updateFiledConfig(key, instance, {
                headers: context.name
            })
        })
    }

})

// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://www.baidu.com",
})
class DemoService<R = any> {
    protected res!: ApiResponse<R>;

    // 设置 api 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    public async getIndex(
        this: DemoService<string>,
        params: any,
        data: any,
        config: RequestConfig,
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
        { since: "monthly" },
        undefined,
        {
            headers: { a: 1 },
        },
    )
    .then((res) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });
