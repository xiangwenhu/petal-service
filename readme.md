## 环境要求
* 支持 Map

## 说明
轻量级的装饰器服务框架，快速搭建请求服务。
比如：
```typescript
import "petal-service";
import { RequestConfig } from "petal-service";
import axios from "axios";

// 自定义 request
const instance = axios.create();
instance.interceptors.request.use(config=>{
    console.log("instance.interceptors.request config.baseUrl",  config.baseURL);
    return config;
})
setPetalRequestInstance(instance);


// 更新配置，比如授权信息，例如jwt, cookies
setPetalConfig({
    headers: {
        token: "token",
    },
});

// 设置baseUrl和超时时间
@petalClassDecorator({
    timeout: 60 * 1000,
    baseURL: "http://www.example.com"
})
class DemoService<R> extends BasePetalService<R>{

    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @petalMethodDecorator({
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
    @petalFieldDecorator("timeout")
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
输出
```shell
classDecorator: DemoService
innerStaticMethodDecorator class:DemoService, method:getIndex
innerFieldDecorator class:DemoService, filed:timeoutValue
Function getIndex final config: {
  timeout: 5000,
  responseType: 'json',
  headers: { token: 'token', userId: 1 },
  baseURL: 'http://www.example.com',
  method: 'get',
  url: '',
  params: { since: 'monthly' }
}
instance.interceptors.request config.baseUrl http://www.example.com
res DemoService static getIndex: 1256
```

## 特性
- 支持多实例
- 支持多级配置    
    实例模式： 方法配置 > 实例属性配置 > 实例config属性 > class的配置 > 自定义默认值 > 系统默认配置   
    静态模式： 方法配置 > 静态属性配置 > 静态config属性 > class的配置 > 自定义默认值 > 系统默认配置
- 支持基于Axios自定义request
- 支持继承
- 支持扩展装饰器(初级)
- 支持path参数，即 /user/:id
- 支持拦截器, 可以通过基于Axios自定义request实现
- 支持静态方法和静态属性
- 支持实例属性config作为配置
- 支持静态属性config作为配置
- BaseServiceClass，快捷使用 res和config属性
- 全局暴露默认实例装饰器
- 打包为组件
```
npm install petal-service
```
- 增强自定义装饰器的介入能力？ (TODO::)
- json配置转服务 (TODO::))


## 使用示例
### 示例1  多级配置
```typescript
import {
    classDecorator, methodDecorator, setConfig, paramsDecorator, fieldDecorator,
    ApiResponse, RequestConfig
} from "petal-service";

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

### 示例2 path参数
```typescript
import {
    classDecorator,
    paramsDecorator,
    methodDecorator,
    ApiResponse, RequestConfig 
} from "petal-service";

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
    methodDecorator,
    ApiResponse,
    RequestConfig,
} from "petal-service";
/**
 * 通过filed自定义headers
 */
const headersDecorator = createDecorator(({ dataStore }) => {
    return function (
        target: any,
        context: ClassFieldDecoratorContext<Function>
    ) {
        context.addInitializer(function () {
            // this 是实例对象, this.constructor 是 class, target 为 undefined
            const instance = this;
            const _class_ = instance.constructor;
            dataStore.updateFieldConfig(_class_, instance, {
                headers: context.name,
            });
        });
    };
});

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
        _config: RequestConfig
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        return this.res.data;
    }
    @headersDecorator headers = {
        AppId: 5000,
    };
}

const serviceA = new DemoService();
serviceA
    .getIndex(
        { since: "monthly" },
        {
            headers: { secId: "xx-xx" },
        }
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
import {
    classDecorator,
    methodDecorator,
    setConfig,
    fieldDecorator,
    ApiResponse, RequestConfig
} from "petal-service";


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
class DemoService {

    static config: RequestConfig = {
        timeout: 90 * 1000
    };

    static res: ApiResponse<any>;
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @methodDecorator({
        method: "get",
        url: "",
    })
    static async getIndex(
        params: any,
        config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        return this.res.data
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator("timeout")
    static timeoutValue = 1000;

    // 设置 实例的baseURL ，优先级: 方法 > 大于实例 > class > 默认值 
    // @fieldDecorator("baseURL")
    static baseURLValue = "https://www.google.com"
}

DemoService
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


### 示例5 继承
```typescript
import {
    classDecorator, methodDecorator, setConfig, paramsDecorator, fieldDecorator,
    ApiResponse, RequestConfig
} from "petal-service";

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
