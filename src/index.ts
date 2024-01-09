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
export const getterDecorator = instance.getterDecorator;
export const setConfig = instance.setConfig;
export const enableLog = instance.enableLog;
export const accessorDecorator = instance.accessorDecorator;
export const getMethodConfig  = instance.getMethodConfig;
export const getStatistics = instance.getStatistics;
export const setRequestInstance = instance.setRequestInstance

// 全局属性申明
declare global {
    namespace globalThis {
        const petalClassDecorator: typeof instance.classDecorator;
        const petalCreateDecorator: typeof instance.createDecorator;
        const petalFieldDecorator: typeof instance.fieldDecorator;
        const petalMethodDecorator: typeof instance.methodDecorator;
        const petalAccessorDecorator: typeof instance.accessorDecorator;
        const petalGetterDecorator: typeof instance.getterDecorator;

        const petalSetConfig: typeof instance.setConfig;
        const petalSetRequestInstance: typeof instance.setRequestInstance;
        const petalEnableLog: typeof instance.enableLog;
        const petalGetMethodConfig: typeof instance.getMethodConfig;
        const petalGetStatistics: typeof instance.getStatistics;

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
g.petalAccessorDecorator = instance.accessorDecorator;
g.petalGetterDecorator = instance.getterDecorator;

g.petalSetConfig = instance.setConfig;
g.petalSetRequestInstance = instance.setRequestInstance;
g.petalEnableLog = instance.enableLog;
g.petalGetMethodConfig = instance.getMethodConfig
g.petalGetStatistics = instance.getStatistics;

g.petalCreateInstance = createInstance;

g.PetalBaseService = BaseService;
