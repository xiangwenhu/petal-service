
import {
    getOwnProperty
} from "../../../src/util";

function getterDecorator(field: string) {

    return function (target: Function, context: ClassGetterDecoratorContext) {

        // target: getter 函数
        context.addInitializer(function () {

            if (!context.static) {
                // this: instance
                // this.constructor: class
            } else {
                // this: class
            }

            console.log(
                "staticFieldDecorator addInitializer here",
                context,
                target
            );

        })


    }

}


class DDService {

    @getterDecorator("headers")
    static get headers() {
        return {
            appId: 5000
        }
    }
}

const dds = new DDService();



getOwnProperty(DDService, "timeout")

