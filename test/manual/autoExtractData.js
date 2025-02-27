
import { enableLog, BaseService, methodDecorator, classDecorator } from "../../src";

// 终端执行  ts-node  .\test\manual\autoExtractData.js    

enableLog();

@classDecorator({
    autoExtractData: true
})
class DemoService extends BaseService {

    @methodDecorator({
        url: "https://baidu.com",
    })
    async getIndex() {
    }

    @methodDecorator({
        url: "https://baidu.com",
    })
    async getIndex2() {
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

