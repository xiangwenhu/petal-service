import { enableLog, BaseService, methodDecorator, getterDecorator } from "../../src";

enableLog();

class DemoService<R = any> extends BaseService<R> {

    @methodDecorator({
        url: "https://www.baidu.com/"
    })
    async getIndex(this: DemoService<string>) {
        return this.res.data;
    }

    @getterDecorator()
    get timeout() {
        return 10 * 1000
    }

    @getterDecorator()
    get withCredentials() {
        return false;
    }

}

const s = new DemoService();
s.getIndex().then((res) => {
    console.log("res:", res.length);
}).catch(err => {
    console.log("err:", err);
})