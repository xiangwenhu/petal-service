function classDecorator(target: any, context: ClassDecoratorContext) {
    context.addInitializer(() => {
        console.log('classDecorator addInitializer here', target);
    })
}
function staticFiledDecorator(target: any, context: ClassFieldDecoratorContext) {
    context.addInitializer(() => {
        console.log('staticFiledDecorator addInitializer here', target);
    })
}
function staticMethodDecorator(target: any, context: ClassMethodDecoratorContext) {
    context.addInitializer(() => {
        console.log('staticMethodDecorator addInitializer here', target);
    })
}
function instanceFiledDecorator(target: any, context: ClassFieldDecoratorContext) {
    context.addInitializer(() => {
        console.log('instanceFiledDecorator addInitializer here', target);
    })
}
function instanceMethodDecorator(target: any, context: ClassMethodDecoratorContext) {
    context.addInitializer(() => {
        console.log('instanceMethod addInitializer here', target);
    })
    function replacementMethod(this: any, ...args: any[]) {
        const result = target.call(this, ...args);
        return result;
    }
    return replacementMethod;
}

@classDecorator
class Person {
    @staticFiledDecorator
    static age: number = 23;
    @staticMethodDecorator
    static run() {
        console.log('run');
    }
    constructor(name: string) {
        console.log('constructor');
        this.name = name;
    }
    @instanceFiledDecorator
    name: string = 'Forest';
    @instanceMethodDecorator
    eat() {
        console.log('eat sth');
    }
}
const p = new Person("Ray");
// 最终的输出
// staticMethodDecorator addInitializer here [Function: run]
// staticFiledDecorator addInitializer here undefined
// classDecorator addInitializer here [class Person] { age: 23 }
// instanceMethod addInitializer here [Function: eat]
// instanceFiledDecorator addInitializer here undefined
// constructor