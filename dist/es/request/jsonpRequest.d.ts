import type { MyOmit, RequestOptions, OptionsBodyFirst } from '../../types';
export type RequestOptionsJsonp = MyOmit<RequestOptions, 'method' | 'headers' | 'body' | 'onProgress' | 'resType' | 'maxRetries' | 'signal'> & {
    body: OptionsBodyFirst;
    callbackNameProperty?: string;
    callbackName?: string;
};
export type RequestorJsonp = (url: String, options?: RequestOptionsJsonp) => Promise<unknown>;
/**
 * @Author: sonion
 * @msg: Promise风格的jsonp版本的网络请求
 * @param {string} url 请求地址
 * @param {object} [options.body] - 请求参数，可选
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选
 * @param {string} [options.callbackNameProperty='callback'] - 后端获取回调函数名的属性。默认callback 可选
 * @param {string} [options.callbackName] - 回调函数名-可选。不指定就自动生成
 * @return {Promise<unknown>} Promise<unknown>响应数据，未做封装
 */
declare const requestJsonp: RequestorJsonp;
export type CreateRequestorJsonp = () => RequestorJsonp;
/**
 * @Author: sonion
 * @msg: 对于通过referrer判断的接口。通过该方法创建不受影响的jsonp请求方法
 * @return {RequestorJsonp}
 */
declare const createJsonp: CreateRequestorJsonp;
export { requestJsonp, createJsonp };
