import { ApiResponse, RequestConfig } from "./types";

export default class BaseService<R = any> {

    // 实例config属性
    constructor(protected config: RequestConfig = {}){
    }

    static config: RequestConfig;

    static res: ApiResponse<any>;
    // @ts-ignore
    protected res: ApiResponse<R>;
}

