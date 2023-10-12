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
- [ ] 服务请求TypeScript提示问题
- [ ] 编写文档
- [ ] 编写文章
