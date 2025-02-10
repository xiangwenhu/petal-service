
import "../../src";

petalEnableLog();


interface OriRes {
    rs: number;
    code: number;
    address: string;
    ip: string;
    isDomain: number;
}

// 设置baseUrl和超时时间
@petalClassDecorator({
    timeout: 60 * 1000,
    baseURL: "https://www.ip.cn"
})
class DemoService<R> extends PetalBaseService<R> {

    // 设置 api method 请求参数，最主要的是url, params, data和额外的config
    @petalMethodDecorator({
        method: "get",
        url: "/api/index?type=0",
    })
    static async getIP() {
        const res = this.res.data as OriRes;
        return {
            code: res.code,
            data: {
                ip: res.ip,
                address: res.address
            }
        }
    }

    // 设置 实例的timeout ，优先级: 方法 > 大于实例 > class > 自定义默认值
    @petalFieldDecorator("timeout")
    static timeoutValue = 5 * 1000;
}

DemoService
    .getIP()
    .then((res) => {
        console.log("res.data:", res.data);
    })
    .catch((err) => {
        console.log("error DemoService static getIP:", err);
    });
