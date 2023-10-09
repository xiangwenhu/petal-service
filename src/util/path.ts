import { Key, compile, pathToRegexp } from "path-to-regexp";
import * as wUrl from "whatwg-url";

// const REG_HOST = /^http(s)?:\/\/(.*?)\//i;
const REG_HTTP_START = /^http(s)?/i;

function isFullHttp(path: string) {
    return REG_HTTP_START.test(path);
}

export function hasPathParams(path: string) {
    let pathToValid = path;
    // https://example:9980/user/:id/:month
    // https://example.com
    if (isFullHttp(path)) {
        const urlIns = new wUrl.URL(path);
        pathToValid = urlIns.pathname;
        // https://example.com 会返回 "/"
        // if(pathToValid === "/"){
        //     return ""
        // }
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

    const url = new wUrl.URL(path);
    const toPath = compile(url.pathname, { encode: encodeURIComponent });
    // TODO:: username password模式？
    const rPath = `${url.protocol}//${url.host}` + toPath(pathParams);
    return rPath;
}