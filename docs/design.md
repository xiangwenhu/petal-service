## 存储结构

数据其实分两类

-   classConfig methods instances 非静态的相互作用
-   classConfig staticMethods staticConfig 相互作用

```typescript
Map {
    ["构造函数class"]: Map {
        /**
         * class 的请求配置
         * 更新：dataStore.updateClassConfig
         */
        "classConfig": RequestConfig,  
        /**
         * class 的方法（原型) 请求配置
         * 更新：dataStore.updateMethodConfig
         */
        "methods": Map {
            // 键为方法， 值为请求配置和一些外的参数配置
            ["方法"]: { 
                // 请求配置
                config: RequestConfig;
                // 方法是否有参数
                hasParams?: boolean;
                // 方法是否有body
                hasBody?: boolean;
                // 方法是否有额外配置
                hasConfig?: boolean;
            }
        },
        /**
         * class 实例 的 属性映射
         * 更新 dataStore.updateFieldConfig
         */
        "instances": Map {
            // class 实例 的 属性映射
            ["class实例"]: {
                // config: RequestConfig;
                fieldPropertyMap: Record<PropertyKey, PropertyKey>;
            }
        },
        /**
         * 静态属性映射
         * 更新: dataStore.updateFieldConfig
         */
        "staticConfig": : {
                // config: RequestConfig; 
                fieldPropertyMap: Record<PropertyKey, PropertyKey>;
            }
        /**
         * 静态方法配置
         * 更新：dataStore.updateMethodConfig
         */
        "staticMethods": Map {
            // 键为方法， 值为请求配置和一些外的参数配置
            ["方法"]: {
                config: RequestConfig;
                hasParams?: boolean;
                hasBody?: boolean;
                hasConfig?: boolean;
            }
        }
    }
}
```

## 目录结构和功能说明
```
src
    dataStore
        index.ts      数据存储
    decorator
        accessor.ts   装饰 accessor
        class.ts      装饰 class，存入默认配置
        filed.ts      装饰 class 的属性， 进行属性映射
        getter.ts     装饰 class getter
        method.ts     装饰 class 的方法，这里是核心，装饰器会更改方法，合并配置，最终发送网络请求。
        util.ts       辅助方法
    types
        datastore.ts  数据存储的typescript申请
        index.ts
        other.ts
        request.ts    请求相关的typescript申请
    util
        index.ts
        path.ts       路径参数相关
    BaseService.ts    服务基类
    const.ts          常量
    createInstance    创建服务实例
    index.ts          全局挂在和导出
    logger.ts         日志
```
