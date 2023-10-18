function staticfieldDecorator(
    target: any,
    context: ClassFieldDecoratorContext
) {
    context.addInitializer(function () {
        // this：class
        // target： undefined
        // context: {"kind":"field","name":"age","static":true,"private":false,"access":{}}
        console.log(
            "staticFieldDecorator addInitializer here",
            context,
            target
        );
    });
}
function instancefieldDecorator(
    target: any,
    context: ClassFieldDecoratorContext
) {
    context.addInitializer(function () {
        // this 是 instance
        // target undefined
        // {"kind":"field","name":"name","static":false,"private":false,"access":{}}
        console.log(
            "instancefieldDecorator addInitializer here",
            context,
            target
        );
    });
}

function staticMethodDecorator(
    target: any,
    context: ClassMethodDecoratorContext
) {
    // this: class
    // target: 静态method
    // context: {"kind":"method","name":"run","static":true,"private":false,"access":{}}
    context.addInitializer(function () {
        console.log(
            "staticMethodDecorator addInitializer here",
            context,
            target
        );
    });
}

function classDecorator(target: any, context: ClassDecoratorContext) {
    context.addInitializer(function () {
        // this: class
        // target: class
        // '{"kind":"class","name":"Class的Name"}'
        console.log("classDecorator addInitializer here", context, target);
    });
}

function instanceMethodDecorator(
    target: any,
    context: ClassMethodDecoratorContext
) {
    context.addInitializer(function () {
        // this: instance
        // target: method
        // {"kind":"method","name":"eat","static":false,"private":false,"access":{}}
        console.log("instanceMethod addInitializer here", context, target);
    });
    function replacementMethod(this: any, ...args: any[]) {
        const result = target.call(this, ...args);
        return result;
    }
    return replacementMethod;
}

@classDecorator
class Person {
    @staticfieldDecorator
    static age: number = 23;
    @staticMethodDecorator
    static run() {
        console.log("run");
    }
    constructor(name: string) {
        console.log("constructor");
        this.name = name;
    }
    @instancefieldDecorator
    name: string = "Forest";
    @instanceMethodDecorator
    eat() {
        console.log("eat sth");
    }
}
const p = new Person("Ray");
// 最终的输出
// staticMethodDecorator addInitializer here [Function: run]
// staticfieldDecorator addInitializer here undefined
// classDecorator addInitializer here [class Person] { age: 23 }
// instanceMethod addInitializer here [Function: eat]
// instancefieldDecorator addInitializer here undefined
// constructor
