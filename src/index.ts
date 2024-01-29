import createInstance from "./createInstance";
import BaseService from "./BaseService";
import { RequestParams, RequestConfig, ApiResponse, RequestParamsPick } from "./types";

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
export const getMethodConfig = instance.getMethodConfig;
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

        type PetalRequestParams<D = any, P = any, PP = Record<string | number, string | number>> = RequestParams<D, P, PP>;

        type PetalRequestConfig<D = any> = RequestConfig<D>;

        type PetalApiResponse<D = any, C = any> = ApiResponse<D, C>

        namespace PetalParamsPick {

            /**
             * config 即 axios 请求的整个配置
             */
            export type Native<D = any> = RequestParamsPick.Native<D>;

            /**
             * path +  config? ,
             * path 示例  /del/:id， id即为path参数 ,
             * config 即 axios 请求的整个配置
             */
            export type Path<P = any> = RequestParamsPick.Path<P>;

            /**
             * path + data + config? ,
             * path 示例  /del/:id， id即为path参数 ,
             * data   即 axios 请求的配置中的 data ,
             * config 即 axios 请求的整个配置
             */
            export type PathData<P = any, D = any> = RequestParamsPick.PathData<P, D>


            /**
             * path + params +  config? ,
             * path 示例  /del/:id， id即为path参数 ,
             * params 即 axios 请求配置中的 params ,
             * config 即 axios 请求的整个配置
             */
            export type PathParams<P = any, PP = any> = RequestParamsPick.PathParams<P, PP>;

            /**
             * path + params + data + config? ,
             * path 示例  /del/:id， id即为path参数 ,
             * params 即 axios 请求配置中的 params ,
             * data   即 axios 请求的配置中的 data ,
             * config 即 axios 请求的整个配置
             */
            export type PathParamsData<P = any, PP = any, D = any> = RequestParamsPick.PathParamsData<P, PP, D>
            /**
             * params +  config? ,
             * params 即 axios 请求配置中的 params ,
             * config 即 axios 请求的整个配置
             */
            export type Params<P = any> = RequestParamsPick.Params<P>;

            /**
             * params + data + config? ,
             * params 即 axios 请求配置中的 params ,
             * config 即 axios 请求的整个配置
             */
            export type ParamsData<P = any, D = any> = RequestParamsPick.ParamsData<P, D>
            /**
             * data + config? ,
             * data   即 axios 请求的配置中的 data ,
             * config 即 axios 请求的整个配置
             */
            export type Data<D = any> = RequestParamsPick.Data<D>
        }
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
