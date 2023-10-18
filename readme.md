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
import { RequestConfig } from "petal-service";

petalEnableLog();
// 设置baseUrl和超时时间
@petalClassDecorator({
    timeout: 60 * 1000,
    baseURL: "https://www.example.com"
})
class DemoService<R> extends PetalBaseService<R>{

    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @petalMethodDecorator({
        url: "",
    })
    static async getIndex(
        this: DemoService<string>,
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
        {
            headers: { userId: 1 },
        }
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
- 增强自定义装饰器的介入能力？ (TODO::)
- json配置转服务 (TODO::))


## 使用示例
* [BaseService + 日志开关](https://github.com/xiangwenhu/petal-service-test/tree/main/test/baseService.ts)
* [自定义装饰器](https://github.com/xiangwenhu/petal-service-test/tree/main/test/createDecorator.ts)
* [创建新实例createInstance](https://github.com/xiangwenhu/petal-service-test/tree/main/test//createInstance.ts)
* [全局默认实例 + 自定义request + 拦截器](https://github.com/xiangwenhu/petal-service-test/tree/main/test/global-customRequest.ts)
* [全局默认实例](https://github.com/xiangwenhu/petal-service-test/tree/main/test/global.ts)
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
- [ ] 下移mergeConfig,在调用中合并config，然后再发http请求，解决访问私有变量|属性？？？
- [ ] 服务请求TypeScript提示问题
- [ ] 编写文档
- [ ] 编写文章
- [ ] yapi 和 swagger 转 service
