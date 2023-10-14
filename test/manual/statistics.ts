import { enableLog, BaseService, methodDecorator, getStatistics } from "../../src";

// enableLog();

class DemoService<R = any> extends BaseService<R>{

    @methodDecorator({
        url: "https://baidu.com/"
    })
    static async getStaticIndex(): Promise<string> {
        return this.res.data;
    }

    @methodDecorator({
        url: "https://baidu.com/"
    })
    getIndex(){
        return this.res.data
    }

}

const ins = new DemoService();

const result = getStatistics(ins);
console.log(JSON.stringify(result, undefined , "\t"));
