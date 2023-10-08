import { accessorDecorator, enableLog, BaseService, methodDecorator } from "../../src";

enableLog();

class DemoService<R = any> extends BaseService<R>{

    @methodDecorator({
        url: "https://baidu.com/"
    })
    static async getIndex(): Promise<string> {
        return this.res.data;
    }

     @accessorDecorator("timeout")
     static accessor timeout: number = 20 * 1000;

}


DemoService.getIndex().then(res => {
    console.log("res:", res.length);
}).catch(err => {
    console.log("err:", err);
})
