import { isObject } from "lodash";
import { RequestConfig, StorageMap, StorageMapValue } from "../types";
import { cloneJSON, hasOwnProperty, isFunction } from "../util";

interface DMethodInfo {
    name: string;
    class: string;
}

type DMethodConfig = {
    count: number;
    methods: DMethodInfo[];
};

export interface StatisticsResult {
    instanceMethods: DMethodConfig;
    staticMethods: DMethodConfig;
}

const EMPTY_RESULT: StatisticsResult = {
    instanceMethods: {
        count: 0,
        methods: [],
    },
    staticMethods: {
        count: 0,
        methods: [],
    },
};

export default class Statistics {
    constructor(public storeMap: StorageMap) {}

    getStatistics (
        classOrInstance: Function | Object | undefined | null = undefined
    ): StatisticsResult {
        if (isFunction(classOrInstance)) {
            return this.countSingleClass(classOrInstance as Function);
        }
        // TODO::
        if (
            isObject(classOrInstance) &&
            isFunction(classOrInstance.constructor)
        ) {
            return this.countSingleClass(classOrInstance.constructor);
        }
        if (classOrInstance === null || classOrInstance === undefined) {
            return Array.from(this.storeMap.keys())
                .map((_class_) => {
                    return this.countSingleClass(_class_);
                })
                .reduce((s, cur) => {
                    s.instanceMethods.count += cur.instanceMethods.count;
                    s.instanceMethods.methods.push(
                        ...cur.instanceMethods.methods
                    );

                    s.staticMethods.count += cur.staticMethods.count;
                    s.staticMethods.methods.push(...cur.staticMethods.methods);
                    return s;
                }, cloneJSON(EMPTY_RESULT) as StatisticsResult);
        }

        throw new Error("参数classOrInstance不是有效的Object或者Function");
    }

    private countMethods(_class_: Function, methods: Function[]) {
        return {
            count: methods.length,
            methods: methods.map((m) => ({
                name: m.name,
                class: _class_.name,
            })),
        };
    }

    private countSingleClass(_class_: Function): StatisticsResult {
        const sv = this.storeMap.get(_class_);
        if (!sv) {
            return cloneJSON(EMPTY_RESULT);
        }
        const methodsMap: StorageMapValue.MethodsMap = (sv.get("methods") ||
            new Map()) as StorageMapValue.MethodsMap;
        const staticMethodsMap: StorageMapValue.MethodsMap = (sv.get(
            "staticMethods"
        ) || new Map()) as StorageMapValue.MethodsMap;

        const methods = Array.from(methodsMap.keys());
        const staticMethods = Array.from(staticMethodsMap.keys());

        return {
            instanceMethods: this.countMethods(_class_, methods),
            staticMethods: this.countMethods(_class_, staticMethods),
        };
    }
}
