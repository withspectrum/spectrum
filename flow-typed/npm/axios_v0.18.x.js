// flow-typed signature: 4ad46d97b50b0c2f5955394366fdc8cf
// flow-typed version: e67d002d9c/axios_v0.18.x/flow_>=v0.25.x <=v0.74.x

declare module "axios" {
  declare interface AxiosTransformer<T> {
    (data: T, headers?: Object): Object;
  }
  declare interface ProxyConfig {
    host: string;
    port: number;
    auth?: {
      username: string,
      password: string
    };
  }
  declare interface Cancel {
    constructor(message?: string): Cancel;
    message: string;
  }
  declare interface Canceler {
    (message?: string): void;
  }
  declare interface CancelTokenSource {
    token: CancelToken;
    cancel: Canceler;
  }
  declare class CancelToken {
    constructor(executor: (cancel: Canceler) => void): CancelToken;
    static source(): CancelTokenSource;
    promise: Promise<Cancel>;
    reason?: Cancel;
    throwIfRequested(): void;
  }
  declare interface AxiosXHRConfigBase<T,R = T> {
    adapter?: <T,R>(config: AxiosXHRConfig<T,R>) => Promise<AxiosXHR<T,R>>;
    auth?: {
      username: string,
      password: string
    };
    baseURL?: string;
    cancelToken?: CancelToken;
    headers?: Object;
    httpAgent?: mixed; // Missing the type in the core flow node libdef
    httpsAgent?: mixed; // Missing the type in the core flow node libdef
    maxContentLength?: number;
    maxRedirects?: number;
    params?: Object;
    paramsSerializer?: (params: Object) => string;
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
    onDownloadProgress?: (progressEvent: ProgressEvent) => void;
    proxy?: ProxyConfig | false;
    responseType?:
      | "arraybuffer"
      | "blob"
      | "document"
      | "json"
      | "text"
      | "stream";
    timeout?: number;
    transformRequest?: AxiosTransformer<T> | Array<AxiosTransformer<T>>;
    transformResponse?: AxiosTransformer<R> | Array<AxiosTransformer<R>>;
    validateStatus?: (status: number) => boolean;
    withCredentials?: boolean;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
  }
  declare type $AxiosXHRConfigBase<T,R = T> = AxiosXHRConfigBase<T,R>;
  declare interface AxiosXHRConfig<T,R = T> extends AxiosXHRConfigBase<T,R> {
    data?: T;
    method?: string;
    url: string;
  }
  declare type $AxiosXHRConfig<T,R = T> = AxiosXHRConfig<T,R>;
  declare class AxiosXHR<T,R = T> {
    config: AxiosXHRConfig<T,R>;
    data: R;
    headers?: Object;
    status: number;
    statusText: string;
    request: http$ClientRequest | XMLHttpRequest;
  }
  declare type $AxiosXHR<T,R = T> = AxiosXHR<T,R>;
  declare type AxiosInterceptorIdent = number;
  declare class AxiosRequestInterceptor<T,R = T> {
    use(
      successHandler: ?(
        response: AxiosXHRConfig<T,R>
      ) => Promise<AxiosXHRConfig<*,*>> | AxiosXHRConfig<*,*>,
      errorHandler: ?(error: mixed) => mixed
    ): AxiosInterceptorIdent;
    eject(ident: AxiosInterceptorIdent): void;
  }
  declare class AxiosResponseInterceptor<T,R = T> {
    use(
      successHandler: ?(response: AxiosXHR<T,R>) => mixed,
      errorHandler: ?(error: $AxiosError<any>) => mixed
    ): AxiosInterceptorIdent;
    eject(ident: AxiosInterceptorIdent): void;
  }
  declare type AxiosPromise<T,R = T> = Promise<AxiosXHR<T,R>>;
  declare class Axios {
    constructor<T,R>(config?: AxiosXHRConfigBase<T,R>): void;
    $call: <T,R>(
      config: AxiosXHRConfig<T,R> | string,
      config?: AxiosXHRConfig<T,R>
    ) => AxiosPromise<T,R>;
    request<T,R>(config: AxiosXHRConfig<T,R>): AxiosPromise<T,R>;
    delete<T,R>(url: string, config?: AxiosXHRConfigBase<T,R>): AxiosPromise<T,R>;
    get<T,R>(url: string, config?: AxiosXHRConfigBase<T,R>): AxiosPromise<T,R>;
    head<T,R>(url: string, config?: AxiosXHRConfigBase<T,R>): AxiosPromise<T,R>;
    post<T,R>(
      url: string,
      data?: mixed,
      config?: AxiosXHRConfigBase<T,R>
    ): AxiosPromise<T,R>;
    put<T,R>(
      url: string,
      data?: mixed,
      config?: AxiosXHRConfigBase<T,R>
    ): AxiosPromise<T,R>;
    patch<T,R>(
      url: string,
      data?: mixed,
      config?: AxiosXHRConfigBase<T,R>
    ): AxiosPromise<T,R>;
    interceptors: {
      request: AxiosRequestInterceptor<mixed>,
      response: AxiosResponseInterceptor<mixed>
    };
    defaults: { headers: Object } & AxiosXHRConfig<*,*>;
  }

  declare class AxiosError<T,R = T> extends Error {
    config: AxiosXHRConfig<T,R>;
    request?: http$ClientRequest | XMLHttpRequest;
    response?: AxiosXHR<T,R>;
    code?: string;
  }

  declare type $AxiosError<T,R = T> = AxiosError<T,R>;

  declare interface AxiosExport extends Axios {
    Axios: typeof Axios;
    Cancel: Class<Cancel>;
    CancelToken: Class<CancelToken>;
    isCancel(value: any): boolean;
    create(config?: AxiosXHRConfigBase<any, any>): Axios;
    all: typeof Promise.all;
    spread(callback: Function): (arr: Array<any>) => Function;
  }
  declare module.exports: AxiosExport;
}
