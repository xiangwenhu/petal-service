import "../../../src/index";
import DemoService from "./service";

petalEnableLog()

petalSetConfig({
    baseURL: "https://www.baidu.com"
})

DemoService.getIndex().then(res=>{
    console.log("res", res);
})