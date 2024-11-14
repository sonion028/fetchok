import type {
  ProcessedOptions,
  Requestor,
  RequestOptions,
  CustomError,
  RequestPromiseReturned,
  Interceptor,
  RequestMainFunc,
} from "../../types";
// 请求参数处理
import { requestParamsHandle } from "../utils/param/support.Headers";
// 创建各类型响应处理函数
import {
  createResponseTypeHandle,
  getResponseType,
} from "../utils/response.util";
// 创建拦截器函数
import { createInterceptor } from "../interceptors/create";

// 这样可以解决返回async函数的返回值使用类型别名报错的问题。语法很怪，但就是可以。这是一个TS未处理的bug
type RequestPromiseReturned2 = RequestPromiseReturned;
const RequestPromiseReturned2 = Promise;
// =====
/**
 * @Author: sonion
 * @msg: fetch请求封装 - 除列以下参数外，其余未列出参数都按fetch参数
 * @param { string } url - 请求地址
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
const request: Requestor = async (
  url: string,
  options?: RequestOptions
): RequestPromiseReturned2 => {
  let processedOptions: ProcessedOptions; // 准备接收处理后的参数
  if (options) {
    ({ url, options: processedOptions } = requestParamsHandle(url, options)); // 参数处理 options是对象所以可以不用返回
    if (options.cancel || options.timeout) {
      const controller = new AbortController();
      options.signal = controller.signal; // 设置信号
      options.cancel = options.cancel || {}; // 设置超时要借用取消，可能没有传cancel参数，就指定默认。就算没传超时还是可能用到
      options.cancel.abort = () => controller.abort();
    } // 超时或者取消
    options.timeout && setTimeout(options.cancel.abort, options.timeout); // options.timeout存在就启动 超时取消
  }
  let retryCount = 0; // 已重试次数
  const maxRetries = processedOptions?.maxRetries || 0; // 最大重试次数，默认值0，不重试。后面数值比较才不会出错
  do {
    try {
      const response = await fetch(url, processedOptions as RequestInit); // 单独测试原生fetch，注意跨域提示不全
      if (!response.ok) {
        // const err: CustomError = new Error(response.statusText || '网络请求错误'); // 重试根据这个判断
        // err.status = response.status; // 将状态加到报错信息里
        // throw err;
        throw {
          status: response.status,
          headers: response.headers,
          msg: response.statusText || "网络请求错误",
        };
      }
      const total = +response.headers.get("content-length"); // 转为数字赋值
      const contentType = response.headers.get("content-type") || "";
      // 获取返回值类型
      const responseType = getResponseType(options?.resType, contentType);
      if (!options?.onProgress || !total) {
        const data = await response[responseType]();
        return { status: response.status, headers: response.headers, data }; // 不带进度的返回
      }
      let loaded = 0,
        responseBody = [];
      const [responseDecoder, resultHandler] =
        createResponseTypeHandle(responseType); // 创建每一部分返回和最终返回处理函数
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          return resultHandler(
            response.status,
            responseBody,
            response.headers,
            total
          ); // 这里处理的返回值。blob用其构造函数处理、否者拼接
        if (options.signal?.aborted)
          throw new DOMException("request canceled", "AbortError"); // 这个支持错误名，fetch原生取消，错误对象name就是AbortError。
        loaded += value.length; // 这里value可能为空，可以加判断或try…catch。暂不加，先测试一段时间。
        responseBody.push(responseDecoder.decode(value)); // blob直接放入数组，否则解码后放入数组
        options.onProgress(loaded, total);
      }
    } catch (err) {
      // 因为用的>=所以都是0的时候就结束返回了
      if (retryCount >= maxRetries || "AbortError" === err.name) {
        // 超次数或手动取消
        // err.status = err.status || -1; // 加一个默认状态
        if ((err as CustomError) instanceof Error) {
          throw { code: -1, msg: err.message, ...err }; // 前端错误，直接抛出
        } else return err; // 服务端错误，重定向到then
      }
    }
  } while (retryCount++ < maxRetries);
};

/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的xhr请求
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
