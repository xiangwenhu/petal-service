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


// 全局属性申明
declare global {
    namespace globalThis {
        const petalClassDecorator: typeof instance.classDecorator;
        const petalCreateDecorator: typeof instance.createDecorator;
        const petalFieldDecorator: typeof instance.fieldDecorator;
        const petalMethodDecorator: typeof instance.methodDecorator;
        const petalParamsDecorator: typeof instance.paramsDecorator;

        const setPetalConfig: typeof instance.setConfig;

        const createPetalInstance: typeof createInstance;

        const BasePetalService: typeof BaseService;
    }
}
// 全局属性设置
var g = globalThis as any;
g.petalClassDecorator = instance.classDecorator;
g.petalCreateDecorator = instance.createDecorator;
g.petalFieldDecorator = instance.fieldDecorator;
g.petalMethodDecorator = instance.methodDecorator;
g.petalParamsDecorator = instance.paramsDecorator;

g.setPetalConfig = instance.setConfig;

g.createPetalInstance = createInstance;

g.BasePetalService = BaseService;
