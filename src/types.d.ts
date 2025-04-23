// =====>公共类型声明文件<=====
// 支持动态属性的Omit
declare type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// 替换对象类型中的成员，不存在就添加
declare type ReplaceType<T, K> = {
  [P in keyof T]: P extends keyof K
    ? K[P] extends undefined
      ? T[P]
      : K[P]
    : T[P];
};

// 取出其中一项工具类
declare type PickOne<T, K extends keyof T> = Pick<T, K>[K];
// 获取Promise返回值类型

// =====>请求部分类型<=====
// 检查全局作用域中是否存在 Headers 和 FormData 类型
type GlobalHeaders = Headers extends undefined ? never : Headers;
type GlobalFormData = FormData extends undefined ? never : FormData;

// 动态对象类型 headers在用
type DynamicObject = {
  [key: string]: string | boolean | number | bigint | void;
};

// 对象版本headers的类型
export type HeadersObject = DynamicObject & { Authorization?: string | void };

// 常用的body类型，第一种
export type OptionsBodyFirst = { [key: string]: any };

// 定义一个兼容多个环境的 OptionsBody 类型
export type OptionsBody = OptionsBodyFirst | GlobalFormData | string;

// 请求参数类型
export type RequestOptions<T = OptionsBody> = {
  // HEAD: 无响应体、CONNECT: 建立资源隧道、TRACE: 测试、PATCH: 部分修改
  method?:
    | "HEAD"
    | "OPTION"
    | "CONNECT"
    | "POST"
    | "GET"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "PATCH"; // 请求方法
  headers?: HeadersObject | GlobalHeaders; // 请求头
  body?: T; // 请求体
  credentials?: "omit" | "same-origin" | "include"; // 忽略、同域发送(默认)、跨域同域都发送
  cancel?: {
    abort?: () => void;
    isCancelled?: boolean; // 是否取消
  };
  onProgress?: (loaded: number, total: number) => void;
  timeout?: number; // 超时时间
  maxRetries?: number; // 最大重试次数
  signal?: AbortSignal; // 信号
  resType?: "text" | "json" | "blob" | "arrayBuffer"; // 返回值类型
  [key: string]: any; // 给一个可能的其他属性
};

// 请求成功返回的内容类型-resolve
export type RequestSuccessResult = {
  status: number;
  headers: Headers;
  data: any;
};

// 服务端错误返回类型-resolve
export type RequestFailedResult = Omit<RequestSuccessResult, "data"> & {
  msg: string;
};

// 自定义 扩展Error对象类型-reject
export interface CustomError extends Error {
  code: number;
  msg: string;
}

// 请求返回值类型
export type RequestPromiseReturned = Promise<
  RequestSuccessResult | RequestFailedResult
>;

// 有上传进度请求的参数
export type RequestOptionsPlus = RequestOptions & {
  upProgress?: PickOne<RequestOptions, "onProgress">;
};

// 请求函数本身类型 还要用接口继承它，再扩展
export type RequestMainFunc = (
  url: string,
  options?: RequestOptions | RequestOptionsPlus
) => RequestPromiseReturned;

// 请求函数类型
export interface Requestor extends RequestMainFunc {
  create: CreateInterceptorFunc;
}

// =========>拦截器类型部分<=========
// 创建拦截器函数类型//
export type CreateInterceptorFunc = (
  interceptors: Interceptor
) => RequestMainFunc;

// token管理器类型
export type TokenManager = {
  _regExp: RegExp;
  _token: string | null;
  token: string | void;
  rawToken: string | void;
  _refreshToken: string | null;
  refreshToken: string;
  rawRefreshToken: string;
};

// 拦截器对象类型
export type Interceptor = {
  request?: (
    url: string,
    options: RequestOptions
  ) => [url: string, options: RequestOptions];
  response?: (
    res: RequestSuccessResult | RequestFailedResult
  ) => RequestSuccessResult | Blob | ArrayBuffer | string | unknown; // 拦截器返回值，其实还可能有
  catch?: (
    err: RequestFailedResult | CustomError
  ) => RequestFailedResult | CustomError;
  finally?: () => void;
};

// =========>参数整理本分<=========
// 请求参数梳理函数处理后的options类型
export type ProcessedOptions = ReplaceType<
  RequestOptions,
  { body?: string | FormData | File | Blob }
>;

// 处理后的参数加url的类型。因为要和node:http一样，统一为一个参数
declare type ProcessedOptionsPlusUrl = ProcessedOptions & { url?: string };

// 请求参数梳理函数类型
declare type RequestParamsHandleFunc = (
  url: string,
  options: RequestOptions
) => {
  url: string;
  options: ProcessedOptions;
};

// =========>node:http、xhr公共部分<=========
// node:http请求参数
export type RequestOptionsHttp = MyOmit<RequestOptions, "body"> & {
  port: number;
  hostname: string;
  path: string;
  body?: string;
};

// node:http、xhr、wx.request内部函数_request的类型
export type RequestMainFuncHttpXhrWx = (
  options: RequestOptionsHttp | ProcessedOptionsPlusUrl
) => ReturnType<RequestMainFunc>;

// =========> 工具类型 <=============
// 判断content-type是否是application/json函数类型
export type IsContentType = (
  headers: RequestOptions["headers"],
  contentType: string
) => boolean;
