import { Key, compile, pathToRegexp } from "path-to-regexp";
import * as wUrl from "whatwg-url";

// const REG_HOST = /^http(s)?:\/\/(.*?)\//i;
const REG_HTTP_START = /^http(s)?/i;


function normalize(url: string) {
    return url.replace(/{(\w+)}/g, ':$1');
}

function isFullHttp(path: string) {
    return REG_HTTP_START.test(path);
}

export function hasPathParams(path: string) {
    // /api/index?type=0  || https://www.ip.cn/api/index?type=0  有queryString部分，pathToRegexp 会报错
    let pathToValid = path.split("?")[0];
    // https://example:9980/user/:id/:month
    // https://example.com
    if (isFullHttp(path)) {
        const urlIns = new wUrl.URL(path);
        pathToValid = urlIns.pathname;
    }
    let keys: Key[] = [];
    pathToValid = normalize(pathToValid);
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

    const [pathname, query] = path.split("?");

    const nPath = normalize(pathname);
    // /user/:id
    if (!isFullHttp(nPath)) {
        const toPath = compile(nPath, { encode: encodeURIComponent });
        const rPath = toPath(pathParams);
        return [rPath, query].filter(Boolean).join("?")
    }

    const url = new wUrl.URL(nPath);
    const toPath = compile(url.pathname, { encode: encodeURIComponent });
    // TODO:: username password模式？
    const rPath = `${url.protocol}//${url.host}` + toPath(pathParams);
    return [rPath, query].filter(Boolean).join("?");
}