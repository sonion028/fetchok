import type { ParamOptionsHttp, ProcessedOptions, RequestMainFuncHttpXhrWx, RequestMainFunc, RequestFunc, ParamOptions, RequestPromiseReturned } from "../../types";
type _requestRetryFunc = (options: ParamOptionsHttp | ProcessedOptions, _requestMain: RequestMainFuncHttpXhrWx) => ReturnType<RequestMainFunc>;
/**
 * @Author: sonion
 * @msg: node:http、xhr基础封装，重试部分。在内部调_request
 * @param {string} url 请求地址
 * @param {object} options 请求参数集
 * @return {promise} 返回promise对象
 */
declare const _requestRetry: _requestRetryFunc;
type TaskList = {
    url: string;
    options: ParamOptions;
}[];
export type concurrencyRequestFunc = (requestFunc: RequestFunc, tasks: TaskList, maxNum: number) => Promise<RequestPromiseReturned[]>;
/**
 * @Author: sonion
 * @msg: 并发控制函数
 * @param {RequestFunc} requestFunc - 请求方法
 * @param {Array} tasks - 请求参数对象数组
 * @param {number} maxNum - 最大并发数
 * @return {Promise<unknown>} - 返回请求Promise数组的Promise
 */
declare const concurrencyRequest: concurrencyRequestFunc;
export { _requestRetry, concurrencyRequest };
