import { enableLog, BaseService, methodDecorator, getterDecorator } from "../../src";

enableLog();

class DemoService<R = any> extends BaseService<R> {

    @methodDecorator({
        url: "https://www.baidu.com/"
    })
    static async getIndex(this: DemoService<string>) {
        return this.res.data;
    }

    @getterDecorator()
    static get timeout() {
        return 10 * 1000
    }
}

DemoService.getIndex().then((res) => {
    console.log("res:", res.length);
}).catch(err => {
    console.log("err:", err);
})