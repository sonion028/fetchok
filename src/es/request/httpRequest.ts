import type {
  RequestOptions,
  RequestOptionsHttp,
  RequestMainFunc,
  Requestor,
  CustomError,
  RequestPromiseReturned,
  Interceptor,
} from "../../types";
import { request as http } from "http";
import { request as https } from "https";
import { createInterceptor } from "../interceptors/create";
// 请求参数处理
import { requestParamsHandle } from "../utils/param/support.Headers";
// 创建各类型响应处理函数
import {
  createResponseTypeHandle,
  getResponseType,
} from "../utils/response.util";
import { _requestRetry } from "../utils/retry.util";

/**
 * @Author: sonion
 * @msg: node:http主要请求部分封装
 * @param {object} options - 请求参数对象
 * @param {string} options.hostname - 请求域名
 * @param {string} options.port - 请求端口
 * @param {string} options.path - 请求路径
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { RequestOptions['headers'] } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选
 * @param { RequestOptions['cancel'] } [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param { RequestOptions['maxRetries'] } [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param { RequestOptions['resType'] } [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param { RequestOptions['onProgress'] } [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return { RequestPromiseReturned } 返回Promise<{status: number, headers: Headers, data: any}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 */
const _request = ({
  body,
  timeout,
  cancel,
  upProgress,
  onProgress,
  resType,
  ...options
}: RequestOptionsHttp): ReturnType<RequestMainFunc> => {
  return new Promise((resolve, reject) => {
    const _http = options.port === 443 ? https : http; // 需要判断是http还是https
    const req = _http(options as Parameters<typeof http>[1], (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        // const err: CustomError = new Error(res.statusMessage);
        // err.status = res.statusCode;
        // reject(err); // 直接返回错误代码的
        resolve({
          status: res.statusCode,
          headers: new Headers(res.headers as HeadersInit),
          msg: res.statusMessage,
        });
        return;
      }
      const total: number = +parseInt(res.headers["content-length"]) || 0;
      const [setUint8Array, resultHandler] = createResponseTypeHandle(total); // 创建每一部分返回和最终返回处理函数
      
      let loaded = 0;
      res.on("data", (chunk: Buffer) => {
        setUint8Array(chunk);
        total && onProgress && onProgress((loaded += chunk.length), total);
      });

      const contentType = res.headers["content-type"] || "";
      const responseType = getResponseType(resType, contentType);
      
      res.on("end", () => {
        // 这里处理的返回值。blob用其构造函数处理、否者拼接
        resolve(
          resultHandler(
            res.statusCode,
            new Headers(res.headers as HeadersInit),
            responseType
          )
        );
      });
    });

    // 超时
    timeout &&
      req.setTimeout(timeout, () => {
        req.destroy();
      });

    //增加取消请求函数
    cancel &&
      (cancel.abort = () => {
        req.destroy();
        cancel.isCancelled = true; // 表示已手动取消
      });
    // 错误
    req.on("error", (err: CustomError) => {
      // err.status = -1 // 前端未知错误
      reject({ code: -1, msg: err.message, ...err }); // 直接返回错误代码的
    });
    //发送请求体
    body && req.write(body); // 上传进度，可以分成多次发送来实现
    req.end();
  });
};

/**
 * @Author: sonion
 * @msg: nodejs http请求封装
 * @param { string } url - 请求url
 * @param { RequestOptions } [options] - 请求参数对象，可选
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { RequestOptions['headers'] } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选
 * @param { RequestOptions['cancel'] } [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param { RequestOptions['maxRetries'] } [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param { RequestOptions['resType'] } [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param { RequestOptions['onProgress'] } [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return { RequestPromiseReturned } 返回Promise<{status: number, headers: Headers, data: any}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 */
const request: Requestor = (
  url: string,
  options?: RequestOptions
): RequestPromiseReturned => {
  let res: ReturnType<typeof requestParamsHandle>["options"];
  if (options) ({ url, options: res } = requestParamsHandle(url, options)); // 参数处理 options是对象所以可以不用返回
  const urlObj = new URL(url);
  const paramString = urlObj.searchParams.toString();
  const processedParams = {
    ...res,
    port: urlObj.protocol === "https:" ? 443 : Number(urlObj.port) || 80,
    hostname: urlObj.hostname,
    path: paramString ? urlObj.pathname + "?" + paramString : urlObj.pathname,
  };
  return _requestRetry(processedParams, _request); // 正式请求开始
};

/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的http请求
 * @param { Interceptor } interceptors - 拦截器对象
 * @param { Interceptor['request'] } [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param { Interceptor['response'] } [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param { Interceptor['catch'] } [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param { Interceptor['finally'] } [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return { RequestMainFunc } 返回使用了拦截器的请求函数。参数和request方法一样。
 */
request.create = (interceptors: Interceptor = {}): RequestMainFunc => {
  return createInterceptor.call(request, interceptors);
};

export { request };
