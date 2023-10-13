import { RequestConfig, StorageMap } from "../types";


type MethodConfig = Record<string, {
    // 请求配置
    config: RequestConfig;
    // 方法是否有参数
    hasParams?: boolean;
    // 方法是否有body
    hasBody?: boolean;
    // 方法是否有额外配置
    hasConfig?: boolean;
}>

interface StatisticsResult {
    className: string;
    classConfig?: RequestConfig,
    methods?: MethodConfig,
    instances?: Record<string, Record<string, string>>,
    staticConfig?: {
        fieldPropertyMap: Record<string, string>,
    }
    staticMethods?: MethodConfig
}


export default class Statistics {
    constructor(public storeMap: StorageMap) {

    }

    private toJSON(obj: Record<string, any>) {
        // TODO::
        return JSON.parse(JSON.stringify(obj));
    }

    private getItemClassConfig(classConfig: RequestConfig): Partial<RequestConfig> {
        return this.toJSON(classConfig);
    }

    private getMethods(methods: MethodConfig): Partial<RequestConfig> {
        return this.toJSON(methods);
    }


    getJSON(): StatisticsResult[] {
        return [...this.storeMap.keys()].map(key => {
            return {
                className: key.name
            }
        })
    }
}