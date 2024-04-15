import type { MyOmit, RequestOptions, OptionsBodyFirst } from '../../types';
export type RequestOptionsSse = MyOmit<RequestOptions, 'method' | 'headers' | 'body' | 'onProgress' | 'resType' | 'maxRetries' | 'signal'> & {
    handler?: (events: Event) => any;
    body: OptionsBodyFirst;
};
export type RequestorSse = (url: string, options: RequestOptionsSse) => EventSource;
/**
 * @Author: sonion
 * @msg: sse请求。该请求基于事件，参数和request参数一样。返回一个事件对象，通过addEventListener注册事件处理函数接收返回值
 * @param {string} url 请求地址
 * @param {object} [options.body] - 请求参数，可选
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选
 * @param {function} [options.handle] - 事件message的处理函数，可选。也可以用返回值注册事件。
 * @return {EventSource}  EventSource对象，addEventListener注册message事件
 */
declare const requestSse: RequestorSse;
export { requestSse };
