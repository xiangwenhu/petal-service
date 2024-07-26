import createInstance from "./createInstance";
import BaseService from "./BaseService";
import { RequestParams, RequestConfig, ApiResponse, RequestParamsPick } from "./types";
import { VERSION } from "./const";

export * from "./types";

// 默认实例导出
export const instance = createInstance();
export const classDecorator = instance.classDecorator;
export const fieldDecorator = instance.fieldDecorator;
export const methodDecorator = instance.methodDecorator;
export const accessorDecorator = instance.accessorDecorator;
export const getterDecorator = instance.getterDecorator;

export const createDecorator = instance.createDecorator;

export const setConfig = instance.setConfig;
export const getConfig = instance.getConfig;
export const getRequester = instance.getRequester;
export const setRequester = instance.setRequester;
export const getLogger = instance.getLogger;
export const setLogger = instance.setLogger;
export const enableLog = instance.enableLog;

export const getMethodConfig = instance.getMethodConfig;
export const getStatistics = instance.getStatistics;

export {
    createInstance,
    BaseService
}
export const version = VERSION;


// 全局属性申明
declare global {
    namespace globalThis {
        // 装饰器
        const petalClassDecorator: typeof instance.classDecorator;
        const petalFieldDecorator: typeof instance.fieldDecorator;
        const petalMethodDecorator: typeof instance.methodDecorator;
        const petalAccessorDecorator: typeof instance.accessorDecorator;
        const petalGetterDecorator: typeof instance.getterDecorator;

        // 创建装饰器
        const petalCreateDecorator: typeof instance.createDecorator;


        // 设置部分
        const petalSetConfig: typeof instance.setConfig;
        const petalGetConfig: typeof instance.getConfig;
        const petalGetRequester: typeof instance.getRequester
        const petalSetRequester: typeof instance.setRequester;
        const petalGetLogger: typeof instance.getLogger;
        const petalSetLogger: typeof instance.setLogger;
        const petalEnableLog: typeof instance.enableLog;

        // 获取配合和统计
        const petalGetMethodConfig: typeof instance.getMethodConfig;
        const petalGetStatistics: typeof instance.getStatistics;

        // 实例部分
        const petalCreateInstance: typeof createInstance;
        const petalDefaultInstance: typeof instance;

        // 基类
        const PetalBaseService: typeof BaseService;

        // 版本
        const PetalVersion: string;


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
g.petalGetConfig = instance.getConfig;
g.petalGetRequester = instance.getRequester;
g.petalSetRequester = instance.setRequester;
g.petalGetLogger = instance.getLogger;
g.petalSetLogger = instance.setLogger;
g.petalEnableLog = instance.enableLog;


g.petalGetMethodConfig = instance.getMethodConfig
g.petalGetStatistics = instance.getStatistics;

g.petalCreateInstance = createInstance;

g.PetalBaseService = BaseService;

g.petalDefaultInstance = instance;

g.petalVersion = VERSION;
