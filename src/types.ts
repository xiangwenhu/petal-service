export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

export type responseEncoding =
    | 'ascii' | 'ASCII'
    | 'ansi' | 'ANSI'
    | 'binary' | 'BINARY'
    | 'base64' | 'BASE64'
    | 'base64url' | 'BASE64URL'
    | 'hex' | 'HEX'
    | 'latin1' | 'LATIN1'
    | 'ucs-2' | 'UCS-2'
    | 'ucs2' | 'UCS2'
    | 'utf-8' | 'UTF-8'
    | 'utf8' | 'UTF8'
    | 'utf16le' | 'UTF16LE';


export interface RequestConfig<D = any> {
    url?: string;
    method?: Method | string;
    baseURL?: string;
    transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
    transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
    headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
    params?: any;
    data?: D;
    timeout?: Milliseconds;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    responseType?: ResponseType;
    responseEncoding?: responseEncoding | string;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export interface AxiosRequestTransformer {
    (this: InternalAxiosRequestConfig, data: any, headers: RequestHeaders): any;
}


export interface InternalAxiosRequestConfig<D = any> extends RequestConfig<D> {
    headers: RawHeaders;
}

interface RawHeaders {
    [key: string]: HeaderValue;
}

export type RawAxiosRequestHeaders = Partial<RawHeaders & {
    [Key in CommonRequestHeadersList]: HeaderValue;
} & {
    'Content-Type': ContentType
}>;


type CommonRequestHeadersList = 'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization';

type ContentType = HeaderValue | 'text/html' | 'text/plain' | 'multipart/form-data' | 'application/json' | 'application/x-www-form-urlencoded' | 'application/octet-stream';

export type HeaderValue = RawHeaders | string | string[] | number | boolean | null;

type CommonResponseHeadersList = 'Server' | 'Content-Type' | 'Content-Length' | 'Cache-Control' | 'Content-Encoding';

type RawCommonResponseHeaders = {
    [Key in CommonResponseHeadersList]: HeaderValue;
} & {
    "set-cookie": string[];
};

export type RawAxiosResponseHeaders = Partial<RawHeaders & RawCommonResponseHeaders>;

export type AxiosResponseHeaders = RawAxiosResponseHeaders & AxiosHeaders;


export type AxiosHeaders = {
    headers: RawHeaders | AxiosHeaders
}

export interface AxiosResponseTransformer {
    (this: InternalAxiosRequestConfig, data: any, headers: AxiosResponseHeaders, status?: number): any;
}

type Milliseconds = number;


type MethodsHeaders = Partial<{
    [Key in Method as Lowercase<Key>]: AxiosHeaders;
} & { common: AxiosHeaders }>;

export interface AxiosProgressEvent {
    loaded: number;
    total?: number;
    progress?: number;
    bytes: number;
    rate?: number;
    estimated?: number;
    upload?: boolean;
    download?: boolean;
    event?: BrowserProgressEvent;
}

type BrowserProgressEvent = any;


export type RawRequestHeaders = Partial<RawHeaders & {
    [Key in CommonRequestHeadersList]: HeaderValue;
  } & {
    'Content-Type': ContentType
  }>;

export type RequestHeaders = RawRequestHeaders & AxiosHeaders;


export interface ApiResponse<T = any, D = any> {
    data: T;
    status: number;
    statusText: string;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    config: InternalAxiosRequestConfig<D>;
    request?: any;
  }








