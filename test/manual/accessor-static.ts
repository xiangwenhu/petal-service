import { accessorDecorator, enableLog, BaseService, methodDecorator,  getMethodConfig} from "../../src";

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

console.log("getIndex config:", getMethodConfig(DemoService, DemoService.getIndex));

DemoService.getIndex().then(res => {
    console.log("res:", res.length);
}).catch(err => {
    console.log("err:", err);
})
