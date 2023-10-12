import { ApiResponse, RequestConfig } from "../../../src/types";
import createInstance from "../../../src/createInstance"

const {
    classDecorator,
    methodDecorator,
    setConfig,
    fieldDecorator,
    paramsDecorator,
    enableLog
} = createInstance({
    defaults: {
        baseURL: "https://github.com",
        timeout: 30 * 1000
    }
});

enableLog();
// 更新配置，比如授权信息，例如jwt, cookies
setConfig({
    headers: {
        token: "token",
    },
});


// 设置baseUrl和超时时间
@classDecorator({
    baseURL: "https://www.baidu.com",
    timeout: 60 * 1000
})
class DemoService<R = any> {

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 默认值 
    @fieldDecorator("timeout")
    #timeoutValue = 5000;

    // 设置 实例的baseURL ，优先级: 方法 > 大于实例 > class > 默认值 
    // @fieldDecorator("baseURL")
    #baseURLValue = "https://www.google.com"


}
