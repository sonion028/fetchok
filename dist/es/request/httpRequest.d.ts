import type { Requestor } from '../../types';
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
declare const request: Requestor;
export { request, };
