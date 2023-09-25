
## 说明
轻量级的装饰器服务

## 特性
- [x] 支持多实例
- [x] 支持多级配置    
    实例模式： 方法配置 > 实例属性配置 > 实例config属性 > class的配置 > 自定义默认值 > 系统默认配置
    静态模式： 方法配置 > 静态属性配置 > 静态config属性 > class的配置 > 自定义默认值 > 系统默认配置
- [x] 支持基于Axios自定义request
- [x] 支持继承
- [x] 支持扩展装饰器(初级)
- [x] 支持path参数，即 /user/:id
- [x] 支持拦截器, 可以通过基于Axios自定义request实现
- [x] 支持静态方法和静态属性
- [x] 支持实例属性config作为配置
- [x] 支持静态属性config作为配置
- [x] BaseServiceClass，快捷使用 res和config属性
- [ ] 增强自定义装饰器的介入能力？
- [ ] json配置转服务 (TODO::))


## 使用示例
### 示例1  多级配置
```typescript
import {  BaseService, classDecorator, methodDecorator, setConfig, fieldDecorator } from "../../src";
import { RequestConfig } from "../../src/types";

// 更新配置，比如授权信息，例如jwt, cookies
setConfig({
    headers: {
        token: "token",
    },
});


// 设置baseUrl和超时时间
@classDecorator({
    timeout: 60 * 1000,
    baseURL: "http://www.example.com"
})
class DemoService<R> extends BaseService<R>{

    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    static async getIndex(
        this: DemoService<string>,
        _params: any,
        _config: RequestConfig,
    ){
        // 不写任何返回， 默认会返回 this.res.data
        return this.res.data
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 自定义默认值
    @fieldDecorator("timeout")
    static timeoutValue = 5 * 1000;
}

DemoService
    .getIndex(
        { since: "monthly" },
        {
            headers: { userId: 1 },
        },
    )
    .then((res: any) => {
        console.log("res DemoService static getIndex:", res.length);
    })
    .catch((err) => {
        console.log("error DemoService static getIndex:", err);
    });

```

### 示例2 path参数
```typescript
import {
    classDecorator,
    paramsDecorator,
    methodDecorator
} from "../../src";
import { ApiResponse, RequestConfig } from "../../src/types";

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
        _pathParams: Record<string, string | number>,
        _config: RequestConfig,
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
import {
    classDecorator,
    createDecorator,
    methodDecorator
} from "../../src";
import { ApiResponse, RequestConfig } from "../../src/types";

/**
 * 通过filed自定义headers
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
        _params: any,
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
        { since: "monthly" },
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

```

输出结果：
```shell
DemoService getIndex final config: {
  timeout: 60000,
  responseType: 'json',
  baseURL: 'https://www.baidu.com',
  headers: { AppId: 5000, a: 1 },
  method: 'get',
  url: '',
  params: { since: 'monthly' }
}
res serviceA getIndex: 227
```

### 示例4 支持静态模式
静态属性和方法，无需实例化
```typescript
import createInstance from "../../src/createInstance"
import { ApiResponse, RequestConfig } from "../../src/types";

const {
    classDecorator, methodDecorator, paramsDecorator, fieldDecorator
} = createInstance({
    defaults: {
        baseURL: "https://juejin.cn"
    }
});

// 设置baseUrl和超时时间
@classDecorator({
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
        _pathParams: Record<string, string | number>,
        _config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        // return this.res!.data
        return this.res.data;
    }

    @fieldDecorator("timeout")
    static timeoutValue = 5000;
}

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
import {
    classDecorator, methodDecorator, setConfig, paramsDecorator, fieldDecorator
} from "../../src";
import { ApiResponse, RequestConfig } from "../../src/types";

setConfig({
    headers: {
        token: "token",
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
        _params: any,
        _data: any,
        _config: RequestConfig
    ) {
        return this.res.data;
    }

    @fieldDecorator("timeout")
    timeoutValue = 5000;

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
        _params: any,
        _config: RequestConfig
    ): Promise<string> {
        return this.res!.data;
    }
    @fieldDecorator("timeout")
    timeoutValue = 30 * 1000;
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
