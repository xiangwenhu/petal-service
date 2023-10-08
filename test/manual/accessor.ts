import { accessorDecorator, enableLog, BaseService, methodDecorator } from "../../src";

enableLog();

class DemoService<R = any> extends BaseService<R>{

    @methodDecorator({
        url: "https://baidu.com/"  //  url: "https://baidu.com 会报错
    })
    async getIndex(this: DemoService<string>): Promise<string> {
        return this.res.data;
    }

     @accessorDecorator()
     accessor timeout: number = 15 * 1000;

}


const service = new DemoService();
service.getIndex().then(res => {
    console.log("res:", res.length);
}).catch(err => {
    console.log("err:", err);
})
