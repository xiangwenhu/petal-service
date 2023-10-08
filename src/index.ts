import createInstance from "./createInstance";
import BaseService from "./BaseService";

export {
    createInstance,
    BaseService
}
export * from "./types";

// 默认实例导出
const instance = createInstance();
export const classDecorator = instance.classDecorator;
export const createDecorator = instance.createDecorator;
export const fieldDecorator = instance.fieldDecorator;
export const methodDecorator = instance.methodDecorator;
export const paramsDecorator = instance.paramsDecorator;
export const setConfig = instance.setConfig;
export const enableLog = instance.enableLog;
export const accessorDecorator = instance.accessorDecorator;

// 全局属性申明
declare global {
    namespace globalThis {
        const petalClassDecorator: typeof instance.classDecorator;
        const petalCreateDecorator: typeof instance.createDecorator;
        const petalFieldDecorator: typeof instance.fieldDecorator;
        const petalMethodDecorator: typeof instance.methodDecorator;
        const petalParamsDecorator: typeof instance.paramsDecorator;
        const petalAccessorDecorator: typeof instance.accessorDecorator;

        const petalSetConfig: typeof instance.setConfig;
        const petalSetRequestInstance: typeof instance.setRequestInstance;

        const petalCreateInstance: typeof createInstance;

        const PetalBaseService: typeof BaseService;
    }
}
// 全局属性设置
var g = globalThis as any;
g.petalClassDecorator = instance.classDecorator;
g.petalCreateDecorator = instance.createDecorator;
g.petalFieldDecorator = instance.fieldDecorator;
g.petalMethodDecorator = instance.methodDecorator;
g.petalParamsDecorator = instance.paramsDecorator;
g.petalAccessorDecorator = instance.accessorDecorator;

g.petalSetConfig = instance.setConfig;
g.petalSetRequestInstance = instance.setRequestInstance;
g.enablePetalLogger = instance.enableLog;

g.petalCreateInstance = createInstance;

g.PetalBaseService = BaseService;
