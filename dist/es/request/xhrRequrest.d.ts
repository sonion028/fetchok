import type { RequestOptions, Requestor } from '../../types';
declare global {
    interface XMLHttpRequest {
        splitHeadersRegExp: RegExp;
        getResponseHeaders: () => Headers;
    }
}
export type RequestOptionsEasy = Omit<RequestOptions, 'onProgress' | 'resType' | 'maxRetries' | 'signal' | 'cancel' | 'timeout' | 'credentials'>;
export type RequestorEasy = (url: string, options: RequestOptionsEasy) => Promise<unknown>;
/**
 * @Author: sonion
 * @msg: 最简单的原始xhr封装，不帮忙完成任何调整。
 * @param {string} url 请求地址
 * @param {object} options - 请求参数对象
 * @param {object} [options.headers] - 请求头
 * @param {string} [options.method] - 请求方法
 * @param {object} [options.body] - 请求体数据
 * @return {Promise} 返回结果没有任何封装Promise<xhr.response>
 */
declare const requestEasy: RequestorEasy;
/**
 * @Author: sonion
 * @msg: xhr请求基础封装
 * @param { string } url - 请求url
 * @param { RequestOptions } [options] - 请求参数对象，可选
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { RequestOptions['headers'] } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选。默认为0(xhr不限制)
 * @param { RequestOptions['cancel'] } [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param { RequestOptions['maxRetries'] } [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param { RequestOptions['resType'] } [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param { RequestOptions['onProgress'] } [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @param { RequestOptionsPlus['upProgress'] } [options.upProgress] - 上传进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return { RequestPromiseReturned } 返回Promise<{status: number, headers: Headers, data: any}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 */
declare const requestXhr: Requestor;
export { requestEasy, requestXhr };
