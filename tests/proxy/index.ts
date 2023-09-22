
class DemoService {

    public async getIndex<R = string>(
        this: any,
        params: any,
    ): Promise<string> {
        // console.log(this.ins.getSomething());
        // return  this.getSomething();
        return this.data
    }

    timeoutValue = 1000;

    baseURLValue = "https://www.google.com"


    getSomething() {
        return  `somethings - ${this.timeoutValue}`
    }
}


const ins = new DemoService();
var proxy = new Proxy(ins, {
    get: function (target, property, receiver) {
        if (property == "res") {
            return { errCode: 100 }
        }
        return Reflect.get(target, property, receiver)
    },
});

// @ts-ignore
console.log("res:", proxy.res);
console.log("getSomething", proxy.getSomething())
