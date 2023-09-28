import { CreateDecoratorOptions, ParamsDecoratorOptions } from "./other";
import { RequestConfig } from "./request";

export interface IClassDecorator {
    (config?: RequestConfig<any>): (
        target: Function,
        context: ClassDecoratorContext<any>
    ) => void;
}

export interface IFieldDecorator {
    (field: keyof RequestConfig<any>): (
        target: any,
        context: ClassFieldDecoratorContext<any, any>
    ) => void;
}

export interface ICreateDecorator {
    (creator: (options: CreateDecoratorOptions) => Function): void;
}

export interface IMethodDecorator<D = any> {
    (config?: RequestConfig<D>): (
        target: Function,
        context: ClassMethodDecoratorContext<
            Function,
            (this: any, ...args: any) => any
        >
    ) => void;
}

export interface IParamsDecorator {
    (options?: ParamsDecoratorOptions): (
        target: Function,
        context: ClassMethodDecoratorContext<
            any,
            (this: any, ...args: any) => any
        >
    ) => void;
}

export interface ISetConfig {
    (config: RequestConfig<any>): void;
}
