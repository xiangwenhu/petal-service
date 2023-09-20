## 存储结构
```typescript
Map {
    ["构造函数class"]: Map {
        "__config__": RequestConfig;
        "apis": Map {
            ["方法"]: {
                config: RequestConfig;
                hasParams?: boolean;
                hasBody?: boolean;
                hasConfig?: boolean;
            }
        },
        "instances": Map {
            ["class实例"]: RequestConfig
        }
    }
}
```

## 实现

### createServiceInstance （src\index.ts）
获取初始化配置，并创建装饰器。
装饰器遵守统一的入参，是可以自行扩展装饰器的。
```typescript
/**
 * 更新配置
 * @param options 
 * @param config 
 */
function setConfig(options: CreateDecoratorOptions, config: RequestConfig) {
    const oldConfig = options.defaults || {};
    Object.assign(oldConfig, config);
}


export function createServiceInstance(config: ServiceRootConfig = {}) {
    const storeMap = createMap<Function, StorageMapValue>();
    const options: CreateDecoratorOptions = {
        storeMap,
        defaults: config.defaults || DEFAULT_CONFIG,
        request: config.request || axios.create() as any,
    };

    return {
        /**
         * class 装饰器
         */
        classDecorator: createClassDecorator(options),
        /**
         * api 装饰器
         */
        apiDecorator: createApiDecorator(options),
        /**
         * api 杂项装饰器
         */
        apiMiscellaneousDecorator: createMiscellaneousDecorator(options),
        /**
         * 通用字段装饰器
         */
        commonFieldDecorator: createCommonFieldDecorator(options),
        /**
         * 更新配置，用户动态设置授权信息等，例如jwt
         * @param config
         * @returns
         */
        setConfig: (config: RequestConfig) => setConfig(options, config),
    }
}
```

### createClassDecorator (src\decorator\class.ts)
装饰class，存入默认配置

```typescript
export function createClassDecorator({ storeMap }: CreateDecoratorOptions) {

    /**
     * 示例
     * @classDecorator({
     *       baseURL: "https://www.api.com",
     *  })
     * class DemoService {
     * }
     */
    return function classDecorator(config: RequestConfig = DEFAULT_CONFIG) {
        return function (target: any, context: ClassDecoratorContext<any>) {
            console.log(":classDecorator");
            if (context.kind !== 'class') {
                return
            }
            context.addInitializer(function () {
                // this 是 class
                const key = this;
                const val: StorageMapValue = (storeMap.get(key) || new Map());
                val.set(STORE_KEY_CONFIG, config);
                storeMap.set(key, val)
            })
        }
    }
}
```

### createApiDecorator (src\decorator\method.ts)
装饰class的方法，这里是核心，装饰器会更改方法，合并配置，最终发送网络请求。



### createCommonFieldDecorator (src\decorator\field.ts)
装饰class的属性