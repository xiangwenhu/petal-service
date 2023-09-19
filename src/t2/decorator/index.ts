import { createMap } from "../../store"
import { CreateDecoratorOptions, ServiceRootConfig } from "../other.type";
import { RequestConfig } from "../types";
import { createClassDecorator } from "./class";
import { DEFAULT_CONFIG } from "./const";
import { createApiDecorator, createMiscellaneousDecorator } from "./method";
import axios from "axios";

function setConfig(options: CreateDecoratorOptions, config: RequestConfig) {
    const oldConfig = options.defaults!;
    Object.assign(oldConfig, config);
}

export function createServiceRoot(config: ServiceRootConfig = {}) {
    const storeMap = createMap();
    const options: CreateDecoratorOptions = {
        storeMap,
        defaults: config.defaults || DEFAULT_CONFIG,
        request: axios.create() as any,
    };

    return {
        classDecorator: createClassDecorator(options),
        apiDecorator: createApiDecorator(options),
        apiMiscellaneousDecorator: createMiscellaneousDecorator(options),
        setConfig: (config: RequestConfig) => setConfig(options, config),
    }
}