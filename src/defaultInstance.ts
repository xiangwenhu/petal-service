import createInstance from "./createInstance";

const g = globalThis as any;

const instance = createInstance();
export const classDecorator = (g.classDecorator = instance.classDecorator);
export const createDecorator = (g.createDecorator = instance.createDecorator);
export const fieldDecorator = (g.fieldDecorator = instance.fieldDecorator);
export const methodDecorator = (g.methodDecorator = instance.methodDecorator);
export const paramsDecorator = (g.paramsDecorator = instance.paramsDecorator);
export const setConfig = (g.setConfig = instance.setConfig);
