## 环境要求
* 支持 Map, Proxy, Reflect
* 支持装饰器新语法, 详情参见：[proposal-decorators](https://github.com/tc39/proposal-decorators)
* 支持装饰器新语法: accessor
```typescript
// 语法示例
type Decorator = (value: Input, context: {
  kind: string;
  name: string | symbol;
  access: {
    get?(): unknown;
    set?(value: unknown): void;
  };
  private?: boolean;
  static?: boolean;
  addInitializer?(initializer: () => void): void;
}) => Output | void;
```

## 说明
轻量级的装饰器服务框架，快速搭建请求服务。
比如：
```typescript
import "petal-service";
import { RequestConfig, enableLog } from "petal-service";

enableLog();
// 设置baseUrl和超时时间
@petalClassDecorator({
    timeout: 60 * 1000,
    baseURL: "https://www.example.com"
})
class DemoService<R> extends PetalBaseService<R>{

    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @petalMethodDecorator({
        method: "get",
        url: "",
    })
    @petalParamsDecorator({
        hasParams: true
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
innerStaticParamsDecorator class:DemoService, method:getIndex
innerStaticMethodDecorator class:DemoService, method:getIndex
innerFieldDecorator class:DemoService, filed:timeoutValue
Function getIndex final config: {
  timeout: 5000,
  responseType: 'json',
  baseURL: 'https://www.example.com',
  method: 'get',
  url: '',
  params: { since: 'monthly' },
  headers: { userId: 1 }
}
res DemoService static getIndex: 1256
```

## 特性
- 支持多实例： 默认示例 + 自定义实例
- 支持多级配置    
    实例模式： 方法配置 > 实例属性配置 > 实例config属性 > class的配置 > 自定义默认值 > 系统默认配置   
    静态模式： 方法配置 > 静态属性配置 > 静态config属性 > class的配置 > 自定义默认值 > 系统默认配置
- 支持服务继承
- 支持自定义装饰器 (初级)
- 支持path路径参数，即 /user/:id 格式
- 支持getter
- 支持accessor 
```typescript
     @accessorDecorator()
     accessor timeout: number = 15 * 1000;
```
- 支持静态方法和静态属性
- 支持基于Axios自定义request
- 支持拦截器, 可以通过基于Axios自定义request实现
- 支持实例属性config作为配置
- 支持静态属性config作为配置
- 内置BaseServiceClass，快捷使用 res和config属性
- 全局暴露默认实例装饰器
- 支持日志开关
```typescript
enableLog(true)
```
- 支持查询方法配置
```typescript
console.log("getIndex config", getMethodConfig(DemoService, DemoService.getIndex));
// 输出
getIndex config: {
  classConfig: {},
  methodConfig: { config: { url: 'https://baidu.com/' } },
  propertyConfig: {},
  fieldConfig: { timeout: 20000 },
  defaultConfig: {}
}
```
- 支持npm安装
```
npm install petal-service
```
- 增强自定义装饰器的介入能力？ (TODO::)
- json配置转服务 (TODO::))


## 使用示例

更多示例 [petal-service-test](https://github.com/xiangwenhu/petal-service-test/)

### 示例1 accessor
```typescript
import { accessorDecorator, enableLog, BaseService, methodDecorator } from "petal-service";

enableLog();

class DemoService<R = any> extends BaseService<R>{

    @methodDecorator({
        url: "https://baidu.com"
    })
    async getIndex(this: DemoService<string>): Promise<string> {
        return this.res.data;
    }

     @accessorDecorator()
     accessor timeout: number = 15 * 1000;

}


const service = new DemoService();
service.getIndex().then(res => {
    console.log("res:", res.length);
}).catch(err => {
    console.log("err:", err);
})

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

enableLog();
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
    enableLog,
    ApiResponse,
    RequestConfig
} from "petal-service";


enableLog();
// 更新配置，比如授权信息，例如jwt, cookies
setConfig({
    headers: {
        token: "token",
    },
});


// 设置baseUrl和超时时间
@classDecorator({
    timeout: 60 * 1000,
    baseURL: "https://www.example.com"
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
        config: RequestConfig,
    ) {
        // 不写任何返回， 默认会返回 this.res.data
        return this.res.data
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator("timeout")
    static timeoutValue = 10 * 1000;
}

DemoService
    .getIndex(
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

### 示例5 getter
```typescript
import { enableLog, BaseService, methodDecorator, getterDecorator } from "petal-service";

enableLog();

class DemoService<R = any> extends BaseService<R> {

    @methodDecorator({
        url: "https://www.baidu.com/"
    })
    async getIndex(this: DemoService<string>) {
        return this.res.data;
    }

    @getterDecorator()
    get timeout() {
        return 10 * 1000
    }

    @getterDecorator()
    get withCredentials() {
        return false;
    }

}

const s = new DemoService();
s.getIndex().then((res) => {
    console.log("res:", res.length);
}).catch(err => {
    console.log("err:", err);
})
```

### 示例5 继承
```typescript
import {
    classDecorator, methodDecorator, setConfig, paramsDecorator, fieldDecorator,
    ApiResponse, RequestConfig
} from "petal-service";
enableLog();
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
    @paramsDecorator({
        hasParams: true
    })
    public async getIndex(
        this: DemoService,
        _params: any,
        _config: RequestConfig
    ) {
        return this.res.data;
    }

    @fieldDecorator("timeout")
    timeoutValue = 15 * 1000;

    // @fieldDecorator("baseURL")
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
参见 [design.md](https://github.com/xiangwenhu/petal-service/blob/master/docs/design.md)

## 注意
1. TypeScript 5.0 的修饰器标准跟之前的修饰器是不兼容的。旧版的 --experimentalDecorators 选项将会仍然保留，如果启用此配置，则仍然会将装饰器视为旧版，新版的装饰器无需任何配置就能够默认启用。
2. 不能装饰私有的属性，方法，getter,accessor，否则会报错


## TODO
- [x] 支持getter
- [x] 去除lodash
- [x] class属性的private检查？
```typescript
    // context.private : false
    @fieldDecorator("baseURL")
    private baseURLValue = "https://www.google.com"

    // context.private : true
    @fieldDecorator("baseURL")
    #baseURLValue = "https://www.google.com"
```
- [x] 优化代理 (无需)
    * Proxy.revocable，方法执行前进行代理，执行完毕后，取消代理
    * Proxy
- [x] 查询方法的各个配置, 入参 class|instance, method
    * 实例方法 {defaultConfig, classConfig, methodConfig, propertyConfig, fieldConfig}
    * 静态方法 {defaultConfig, classConfig, methodConfig, propertyConfig, fieldConfig }
- [ ] 统计
- [ ] dataStore存储关系图
- [ ] 下移mergeConfig,在调用中合并config，然后再发http请求，解决访问私有变量|属性？？？
- [ ] 服务请求TypeScript提示问题
- [ ] 编写文档
- [ ] 编写文章
- [ ] yapi 和 swagger 转 service
