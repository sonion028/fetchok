import { RequestOptions, HeadersObject } from '../../../types';
/**
 * @Author: sonion
 * @msg: 获取content-type、content-length
 * @param {HeadersObject} headers - 普通对象headers
 * @return {*}
 */
declare const getObjectHeadersKey: (headers: HeadersObject) => {
    contentType: string;
    contentLength: string;
};
/**
 * @Author: sonion
 * @msg: 请求参数处理，适合不支持Headers的场景。如：微信小程序
 * @param {string} url - 请求url
 * @param {object} options - 请求参数
 * @return {object}
 */
declare const requestParamsHandle: (url: string, options: RequestOptions) => {
    url: string;
    options: import("../../../types").ReplaceType<RequestOptions<import("../../../types").OptionsBody>, {
        body?: string;
    }>;
};
export { getObjectHeadersKey, // 获取content-type、content-length
requestParamsHandle };
