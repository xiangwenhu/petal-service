import { Key, compile, pathToRegexp } from "path-to-regexp";

const REG_HOST = /^http(s)?:\/\/(.*?)\//i;
const REG_HTTP_START = /^http(s)?/i;

function isFullHttp(path: string) {
    return REG_HTTP_START.test(path);
}

export function hasPathParams(path: string) {
    let pathToValid = path;
    // "https://example:9980/user/:id/:month";
    if (isFullHttp(path)) {
        pathToValid = pathToValid.replace(REG_HOST, "/");
    }

    let keys: Key[] = [];
    pathToRegexp(pathToValid, keys);
    return keys.length > 0;
}

export function pathToUrl(
    path: string,
    pathParams: Record<string, string | number>
) {
    // path并无参数
    if (!hasPathParams(path)) {
        return path;
    }

    // /user/:id
    if (!isFullHttp(path)) {
        const toPath = compile(path, { encode: encodeURIComponent });
        return toPath(pathParams);
    }

    const length = path.length;
    const vPath = path.replace(REG_HOST, "/");
    const vLength = vPath.length;

    const toPath = compile(vPath, { encode: encodeURIComponent });

    const url = path.substring(0, length - vLength )  + toPath(pathParams);

    return url;
}
