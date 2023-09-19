import { classDecorator } from "./decorator/class";
import { methodDecorator } from "./decorator/method"

@classDecorator({
    baseURL: "https://github.com"
})
class DemoService {
    @methodDecorator({
        method: "get",
        url: "index.html"
    })
    async getIndex<R = string>(this: any) {
        return this.data
    }
}


const serviceA = new DemoService();
serviceA.getIndex().then(res => {
    console.log("resA:", res.length)
}).catch(err => {
    console.log("error:", err);
})

const serviceB = new DemoService();
serviceB.getIndex().then(res => {
    console.log("resB:", res.length)
}).catch(err => {
    console.log("error:", err);
})
