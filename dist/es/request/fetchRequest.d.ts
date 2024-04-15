import type { RequestFunc } from '../../types';
/**
 * @Author: sonion
 * @msg: fetch请求封装 - 除列以下参数外，其余未列出参数都按fetch参数
 * @param {string} url - 请求地址
 * @param {object} [options] - 请求的选项参数对象，可选
 * @param {string} [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param {object} [options.headers={}] - 请求头，可选，默认为空对象
 * @param {object} [options.body] - 请求体，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param {'text'|'json'|'blob'|'arrayBuffer'} [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param {function} [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return {Promise<any>} 返回Promise<{status: number, headers: Headers, data: any, msg: string}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 * @property [msg] - 提示信息。没有出错一般没有改属性
 */
declare const request: RequestFunc;
export { request };
