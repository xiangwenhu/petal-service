
import {
    getOwnProperty
} from "../../../src/util";

function accessorDecorator(field: string) {

    return function (target: ClassAccessorDecoratorTarget<any, any>, context: ClassAccessorDecoratorContext) {
        // context.addInitializer(function () {
        //     // this：class
        //     // target： {get: ƒ, set: ƒ}
        //     // context: {"kind":"accessor","name":"headers","static":true,"private":false,"access":{has: ƒ, get: ƒ, set: ƒ}}
        //     console.log(
        //         "staticFieldDecorator addInitializer here",
        //         context,
        //         target
        //     );

        // })


        if (!context.static) {
            // this: instance
            // this.constructor: class
        } else {
            // this: class
        }

        const result: ClassAccessorDecoratorResult<any, any> = {
            get(this) {
                console.log("get value:");
                return target.get.call(this);
            },
            set(value: any) {
                console.log("set value:", value);
                target.set.call(this, value);
            },
            init(initialValue) {
                console.log(`field:${field}, initialValue:`, initialValue);
                return initialValue
            },
        };

        return result;
    }

}


class DDService {

    // @accessorDecorator
    accessor headers: any = {
        AppId: 10
    };

    @accessorDecorator("timeout")
    static accessor timeout: number = 5000;
}

const dds = new DDService();

dds.headers = {
    AppId: "20"
};


getOwnProperty(DDService, "timeout")

