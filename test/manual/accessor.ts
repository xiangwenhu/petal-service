import { accessorDecorator, enableLog, BaseService, methodDecorator } from "../../src";

enableLog();

class DemoService<R = any> extends BaseService<R>{

    @methodDecorator({
        url: "https://baidu.com"
    })
    async getIndex(this: DemoService<string>): Promise<string> {
        // console.log("this.something:", this.#someThing);
        return this.res.data;
    }

    @accessorDecorator()
    accessor timeout: number = 15 * 1000;

    #someThing = "someThings";

}


const service = new DemoService();
service.getIndex().then(res => {
    console.log("res:", res.length);
}).catch(err => {
    console.log("err:", err);
})
