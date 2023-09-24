
## 说明
轻量级的装饰器服务

## 特性
- [x] 支持多实例
- [x] 支持多级配置
    方法配置 > 实例配置 > class的配置 > 自定义默认值 > 系统默认配置
- [x] 支持基于Axios自定义request
- [x] 支持继承
- [x] 支持扩展装饰器(初级支持)
- [x] 支持path参数，即 /user/:id
- [x] 支持拦截器, 可以通过基于Axios自定义request实现
- [x] 支持静态方法和静态属性
- [x] 支持实例config属性作为请求的config
- [x] 支持静态属性config作为请求的config
- [x] 支持 BaseServiceClass 以方便res和静态res
- [ ] 增强自定义装饰器的介入能力？
- [ ] json配置转服务 (TODO::))


## 使用示例
### 示例1  多级配置
```typescript
import { createServiceInstance } from "../src";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    methodDecorator,
    setConfig,
    fieldDecorator,
    paramsDecorator
} = createServiceInstance({
    defaults: {
        baseURL: "https://github.com",
        timeout: 30 * 1000
    }
});

// 更新配置，比如授权信息，例如jwt, cookies
setConfig({
    headers: {
        token: "ccccc",
    },
});


// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://www.baidu.com",
    timeout: 60 * 1000
})
class DemoService<R = any> {

    protected res!: ApiResponse<R>;
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    @paramsDecorator({
        hasParams: true,
        hasBody: false,
        hasConfig: true
    })
    public async getIndex(
        this: DemoService<string>,
        params: any,
        config: RequestConfig,
    ){
        const something = this.getSomething();
        console.log("something: ", something);
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator("timeout")
    timeoutValue = 1000;

    // 设置 实例的baseURL ，优先级: 方法 > 大于实例 > class > 默认值 
    // @fieldDecorator("baseURL")
    baseURLValue = "https://www.google.com"


    getSomething() {
        return `something - ${this.timeoutValue}`
    }
}

const serviceA = new DemoService();
serviceA
    .getIndex(
        { since: "monthly" },
        {
            headers: { userId: 1 },
        },
    )
    .then((res: any) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });

```

### 示例2 path参数
```typescript
import { createServiceInstance } from "../src";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    paramsDecorator,
    methodDecorator
} = createServiceInstance();


// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://juejin.cn",
    timeout: 60 * 1000
})
class DemoService<R = any> {

    protected res!: ApiResponse<R>;

    // 设置 api 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "/course/:type",
    })
    @paramsDecorator({
        hasParams: false,
    })
    public async getIndex(
        this: DemoService<string>,
        pathParams: Record<string, string | number>,
        config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
        return this.res.data
    }
}

const serviceA = new DemoService();
serviceA
    .getIndex(
        {
            type: 'frontend'
        },
        {
            headers: { userId: 1 },
        },
    )
    .then((res) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });

```


### 示例3 自定义装饰器
如下代码，通过field装饰器，添加headers
```typescript
import { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import { createServiceInstance } from "../src";
import { StorageMapValue } from "../src/other.type";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    createDecorator,
    apiDecorator
} = createServiceInstance({
    defaults: {
        baseURL: "https://github.com",
        timeout: 30 * 1000
    }
});

/**
 * 通过filed自定义headers
 */
const headersDecorator = createDecorator(({ storeMap, updateFiledConfig }) => {
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
    @apiDecorator({
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


```

输出结果：
```shell
classDecorator: DemoService
apiDecorator class:DemoService, method:getIndex
DemoService getIndex final config: {
  baseURL: 'https://www.baidu.com',
  timeout: 30000,
  headers: { AppId: 5000 },
  method: 'get',
  url: '',
  params: { since: 'monthly' },
  data: { headers: { a: 1 } }
}
res serviceA getIndex: 227
```

### 示例4 支持静态模式
静态属性和方法，无需实例化
```typescript
import { createServiceInstance } from "../src";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    methodDecorator,
    paramsDecorator,
    fieldDecorator
} = createServiceInstance();


// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://juejin.cn",
    timeout: 60 * 1000
})
class DemoService {

    static res: ApiResponse;

    @methodDecorator({
        method: "get",
        url: "/course/:type",
    })
    @paramsDecorator({
        hasParams: false
    })
    static async getCourse(
        this: typeof DemoService,
        pathParams: Record<string, string | number>,
        config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
        return this.res.data;        
    }

    @fieldDecorator("timeout")
    static timeoutValue = 5000;
}

var a: DemoService = {} as  any;


DemoService
    .getCourse(
        {
            type: "frontend"
        },
        {
            headers: { userId: 1 },
        },
    )
    .then((res) => {
        console.log("res serviceA getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error serviceA getIndex:", err);
    });

```


### 示例5 继承
```typescript
import Axios from "axios";
import { createServiceInstance } from "../src";
import { ApiResponse, RequestConfig } from "../src/types";

const {
    classDecorator,
    methodDecorator,
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
class DemoService<R = any> {

    protected res!: ApiResponse<R>;

    @methodDecorator({
        method: "get",
        url: "",
    })
    public async getIndex(
        this: DemoService,
        params: any,
        data: any,
        config: RequestConfig
    ) {
        return this.res.data;
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

    @methodDecorator({
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

```



## 代码思路和存储
参见 [design.md](/docs/design.md)

## 注意
1. TypeScript 5.0 的修饰器标准跟之前的修饰器是不兼容的。旧版的 --experimentalDecorators 选项将会仍然保留，如果启用此配置，则仍然会将装饰器视为旧版，新版的装饰器无需任何配置就能够默认启用。
