
## 说明
轻量级的装饰器服务

## 使用示例
```typescript
import { createServiceRoot } from "./decorator"

const { classDecorator, apiDecorator, setConfig, apiParamsDecorator, apiBodyDecorator } = createServiceRoot();

// 用于设置授权或者其他
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


```

## 注意
1. TypeScript 5.0 的修饰器标准跟之前的修饰器是不兼容的。旧版的 --experimentalDecorators 选项将会仍然保留，如果启用此配置，则仍然会将装饰器视为旧版，新版的装饰器无需任何配置就能够默认启用。
