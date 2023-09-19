
export function timeFieldDecorator() {
    return function (value: any, context: ClassFieldDecoratorContext) {
        console.log(":timeFieldDecorator");

        if (context.kind !== 'field') {
            return
        }
        context.addInitializer(() => {

        })
    }
}

export function baseURLFieldDecorator() {
    return function (value: any, context: ClassFieldDecoratorContext) {
        console.log(":baseURLFieldDecorator");
        if (context.kind !== 'field') {
            return
        }
        context.addInitializer(() => {
        })
    }
}


export function commonConfigFieldDecorator() {
    console.log(":commonConfigFieldDecorator");
    return function (value: any, context: ClassFieldDecoratorContext) {
        if (context.kind !== 'field') {
            return
        }
    }
}