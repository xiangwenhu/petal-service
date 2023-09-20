
## 支持
- [ ] 多实例
    通过create 返回 装饰器种类和内置配置



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