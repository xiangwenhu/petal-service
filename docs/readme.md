
与之前版本实验性的修饰器的不同
之前版本的 TypeScript 也支持修饰器（https://typescript.bootcss.com/decorators.html），需要增加--experimentalDecorators编译选项。
TypeScript 5.0 的修饰器标准跟之前的修饰器是不兼容的。旧版的 --experimentalDecorators 选项将会仍然保留，如果启用此配置，则仍然会将装饰器视为旧版，新版的装饰器无需任何配置就能够默认启用。
TypeScript5.0 的修饰器标准跟之前的元数据反射（https://www.typescriptlang.org/docs/handbook/decorators.html#metadata）是不兼容的。
写类型完备的修饰器
推荐写类型完备的修饰器。如果写类型完备的修饰器，不免会用到很多泛型、类型参数，这样也会影响代码的可读性。怎么写修饰器后面会有更多的文档出来。先推荐了一篇文章：《JavaScript metaprogramming with the 2022-03 decorators API》https://2ality.com/2022/10/javascript-decorators.html




## 
> [TypeScript 5.0 已发布！看看增加了什么新功能](https://developer.aliyun.com/article/1218924)