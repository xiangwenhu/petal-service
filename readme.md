## 环境要求
* 支持 Map, Proxy, Reflect
* 支持装饰器新语法, 详情参见：[proposal-decorators](https://github.com/tc39/proposal-decorators)
* 如果使用TypeScript, TypeScript 5.0以上并且不设置experimentalDecorators。5.0的修饰器标准跟之前的修饰器是不兼容的。旧版的 --experimentalDecorators 选项将会仍然保留，如果启用此配置，则仍然会将装饰器视为旧版，新版的装饰器无需任何配置就能够默认启用。
* 支持装饰器新语法: accessor

简单就是 E6+ `+` typescript 5.0 +

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

// 允许打印日志
petalEnableLog(true);

// 更新配置，比如授权信息，例如jwt, cookies
petalSetConfig({
    headers: {
        token: "token",
    },
});

// 设置baseUrl和超时时间
@petalClassDecorator({
    timeout: 60 * 1000,
    baseURL: "http://www.example.com",
})
class DemoService extends PetalBaseService {
    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @petalMethodDecorator({
        method: "post",
        url: "",
    })
    static async getIndex(
        _params: PetalParamsPick.Params<{ since: string }>,
    ): Promise<string> {
        return this.res.data;
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 自定义默认值
    @petalFieldDecorator("timeout")
    static timeoutValue = 5 * 1000;
}

// 调用
DemoService.getIndex(
    {
        params: { since: "monthly" },
        config: {
            headers: { userId: 1 },
        },
    }
)
    .then((res) => {
        console.log("res DemoService static getIndex:", res);
    })
    .catch((err) => {
        console.log("error DemoService static getIndex:", err);
    });

```
输出
```shell
innerStaticMethodDecorator class:DemoService, method:getIndex
innerFieldDecorator class:DemoService, field:timeoutValue
Function getIndex final config: {
  timeout: 5000,
  responseType: 'json',
  baseURL: 'https://www.example.com',
  method: 'get',
  url: '',
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
- 支持path路径参数，即 `/user/:id` 和 `/user/{id}` 格式
- 支持getter
- 支持accessor 
```typescript
     @accessorDecorator()
     accessor timeout: number = 15 * 1000;
```
- 支持静态方法和静态属性
- 支持基于Axios自定义requester
- 支持拦截器
- 支持实例属性config作为配置
- 支持静态属性config作为配置
- 内置BaseServiceClass，快捷使用 res和config属性
- 全局暴露默认实例装饰器
- 支持日志开关
```typescript
enableLog(true)      // 自行引入
petalEnableLog(true) // 全局暴露
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
- 支持统计
```typescript
const ins = new DemoService();
const result = getStatistics(ins);
console.log(JSON.stringify(result, undefined , "\t"));

//输出
{
	"instanceMethods": {
		"count": 1,
		"methods": [
			{
				"name": "getIndex",
				"class": "DemoService"
			}
		]
	},
	"staticMethods": {
		"count": 1,
		"methods": [
			{
				"name": "getStaticIndex",
				"class": "DemoService"
			}
		]
	}
}
```
- 支持npm安装
```
npm install petal-service
```



## 使用示例
* [BaseService + 日志开关](https://github.com/xiangwenhu/petal-service-test/tree/main/test/baseService.ts)
* [自定义装饰器](https://github.com/xiangwenhu/petal-service-test/tree/main/test/createDecorator.ts)
* [创建新实例](https://github.com/xiangwenhu/petal-service-test/tree/main/test/createInstance.ts)
* [创建新实例 + createRequester ](https://github.com/xiangwenhu/petal-service-test/tree/main/test/createInstance-createRequester.ts)
* [默认实例 + 拦截器](https://github.com/xiangwenhu/petal-service-test/tree/main/test/global-interceptors.ts)
* [使用自定义的requestor](https://github.com/xiangwenhu/petal-service-test/tree/main/test/setRequestor.ts)
* [默认实例](https://github.com/xiangwenhu/petal-service-test/tree/main/test/global.ts)
* [getter](https://github.com/xiangwenhu/petal-service-test/tree/main/test/getter.ts)
* [静态getter](https://github.com/xiangwenhu/petal-service-test/tree/main/test/getter-static.ts)
* [继承](https://github.com/xiangwenhu/petal-service-test/tree/main/test/inherit.ts)
* [class config属性作为配置](https://github.com/xiangwenhu/petal-service-test/tree/main/test/instanceConfig.ts)
* [path路径参数](https://github.com/xiangwenhu/petal-service-test/tree/main/test/pathUrl.ts)
* [静态方法和静态属性配置](https://github.com/xiangwenhu/petal-service-test/tree/main/test/static.ts)
* [静态属性config作为配置](https://github.com/xiangwenhu/petal-service-test/tree/main/test/staticConfig.ts)
* [accessor](https://github.com/xiangwenhu/petal-service-test/tree/main/test/accessor.ts)
* [静态accessor](https://github.com/xiangwenhu/petal-service-test/tree/main/test/accessor-static.ts)
* [查询方法的config](https://github.com/xiangwenhu/petal-service-test/tree/main/test/getMethodConfig.ts)
* [方法统计](https://github.com/xiangwenhu/petal-service-test/tree/main/test/staticConfig.ts)
* [使用全局暴露的实例方法执行方法统计](https://github.com/xiangwenhu/petal-service-test/tree/main/test/global-statistics.ts)
* [装饰非异步方法](https://github.com/xiangwenhu/petal-service-test/tree/main/test/noPromiseMethod.ts)
* [处理返回结果](https://github.com/xiangwenhu/petal-service-test/tree/main/test/handleResult.ts)

## 代码思路和存储
参见 [design.md](https://github.com/xiangwenhu/petal-service/blob/master/docs/design.md)

## 注意
1. TypeScript 5.0 的修饰器标准跟之前的修饰器是不兼容的。旧版的 --experimentalDecorators 选项将会仍然保留，如果启用此配置，则仍然会将装饰器视为旧版，新版的装饰器无需任何配置就能够默认启用。
2. 不能装饰私有的属性，方法，getter,accessor，否则会报错  
3. 被methodDecorator装饰器装饰过的方法访问私有属性会报错，因为这里的this是一个代理对象。    
关于代理对象不能访问私有属性，参见：
* [Private fields incompatible with JS Proxy](https://github.com/evanw/esbuild/issues/1969)
* [ES6 proxied class, access private property](https://stackoverflow.com/questions/67416881/es6-proxied-class-access-private-property-cannot-read-private-member-hidden-f)
```typescript
    @methodDecorator({
        url: "https://baidu.com"
    })
    async getIndex(this: DemoService<string>): Promise<string> {
        console.log('this.#name', this.#name);   // 报错
        return this.res.data;
    }

    #name = 10;
```


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
- [x] 统计
- [x] setRequestInstance参数修改为函数，传入内置的创建实例的函数，配置，实例等
- [x] dataStore存储关系图
- [x] 调整存储结构
- [x] 支持模拟参数，获取最后请求参数
- [x] 重复装饰问题, method和class重复装饰，会logger.warn
- [x] 服务请求TypeScript提示问题 (PetalParamsPick 命令空间)
- [x] 全局示例支持设置logger
- [x] 提供直接发起网络请求的方法 (getRequestor()可以获取)
- [x] 逻辑问题：被装饰的方法如果返回的值是 undefined，那么默认返回的是 res.data, 问题在于如果res.data不是undefined, 但是res.data.list是undefined    
   **使用extractData: boolean显示配置**   
- [ ] 除了全局暴露装饰器方法，其他的暴露为对象?? 全局暴露 petal???


## TODO  低优先级
- [ ] 支持cache?, 参考[make-fetch-happen](https://github.com/npm/make-fetch-happen/tree/main/lib/cache)
- [ ] 支持mock? 参见 [axios-mock-adapter](https://www.npmjs.com/package/axios-mock-adapter)
- [ ] 下移mergeConfig,在调用中合并config，然后再发http请求，解决访问私有变量|属性？？？
- [ ] 编写文档
- [ ] 编写文章
- [ ] yapi 和 swagger 转 service,参见 [yapi-to-petal-service](https://github.com/xiangwenhu/yapi-to-petal-service) 和 [swagger-to-petal-service](https://github.com/xiangwenhu/swagger-to-petal-service)
- [ ] node-fetch 版本？