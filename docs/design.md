## 存储结构

数据其实分两类

-   classConfig methods instances 非静态的相互作用
-   classConfig staticMethods staticConfig 相互作用

```typescript
Map {
    ["构造函数class"]: Map {
        // class 的请求配置
        "classConfig": RequestConfig,
        // class 的方法（原型) 请求配置
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
        // class 实例 的 属性映射
        "instances": Map {
            // class 实例 的 属性映射
            ["class实例"]: {
                // config: RequestConfig;
                fieldPropertyMap: Record<PropertyKey, PropertyKey>;
            }
        },

        // 静态属性映射
        "staticConfig": : {
                // config: RequestConfig; 
                fieldPropertyMap: Record<PropertyKey, PropertyKey>;
            }
        // 静态方法配置
        "staticMethods": Map {
            // 键为方法， 值为请求配置和一些外的参数配置
            ["方法"]: {
                config: RequestConfig;
                hasParams?: boolean;
                hasBody?: boolean;
                hasConfig?: boolean;
            }
        },
    }
}
```

## 实现

### createServiceInstance （src\index.ts）

获取初始化配置，并创建装饰器。
装饰器遵守统一的入参，是可以自行扩展装饰器的。


### createClassDecorator (src\decorator\class.ts)

装饰 class，存入默认配置

### createMethodDecorator (src\decorator\method.ts)

装饰 class 的方法，这里是核心，装饰器会更改方法，合并配置，最终发送网络请求。

### createFieldDecorator (src\decorator\field.ts)

装饰 class 的属性， 进行属性映射
