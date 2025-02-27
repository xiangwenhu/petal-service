import { accessorDecorator, enableLog, BaseService, methodDecorator, classDecorator } from "../../src";

enableLog();

@classDecorator({
    autoExtractData: true
})
class DemoService<R = any> extends BaseService<R> {

    @methodDecorator({
        url: "https://baidu.com"
    })
    // @ts-ignore
    async getIndex(this: DemoService<string>): Promise<string> {
    }

    @methodDecorator({
        url: "https://baidu.com"
    })
    // @ts-ignore
    async getIndex2(this: DemoService<string>): Promise<string> {
    }

}


const service = new DemoService();
service.getIndex().then(res => {
    console.log("getIndex res:", res.length);
}).catch(err => {
    console.log("err:", err);
});
service.getIndex2().then(res => {
    console.log("getIndex2 res:", res.length);
}).catch(err => {
    console.log("err:", err);
})

