import type { ParamOptions, RequestFunc } from '../../types';
declare global {
    interface XMLHttpRequest {
        splitHeadersRegExp: RegExp;
        getResponseHeaders: () => Headers;
    }
}
export type ParamOptionsEasy = Omit<ParamOptions, 'onProgress' | 'resType' | 'maxRetries' | 'signal' | 'cancel' | 'timeout' | 'credentials'>;
export type RequestFuncEasy = (url: string, options: ParamOptionsEasy) => Promise<unknown>;
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
declare const requestEasy: RequestFuncEasy;
/**
 * @Author: sonion
 * @msg: xhr请求基础封装
 * @param {string} url - 请求地址
 * @param {object} [options] - 请求的选项参数，可选
 * @param {string} [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param {object} [options.headers={}] - 请求头，可选，默认为空对象
 * @param {object} [options.body] - 请求体，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选，默认为0(xhr不限制)
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param {'text'|'json'|'blob'|'arrayBuffer'} [options.resType] - 手动设置返回类型，可选。blob必须手动指定
 * @param {function} [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @param {function} [options.upProgress] - 上传进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return {Promise} 返回Promise<{status: number, data: Blob, msg: string, headers: Headers}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在改属性。
 * @property [msg] - 提示信息。没有出错一般没有改属性
 */
declare const requestXhr: RequestFunc;
export { requestEasy, requestXhr };
