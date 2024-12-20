import type { RequestOptions, RequestSuccessResult } from '../../types';
/**
 * @Author: sonion
 * @msg: 创建'json'、'text'、'blob'三种返回格式的处理函数。第一个是push前的Decoder对象，第二个是最终返回处理函数
 * @param {'json'|'text'|'blob'} responseType
 * @return {[object, function]}
 */
declare const createResponseTypeHandle: (responseType: RequestOptions['resType']) => [TextDecoder | {
    decode: (any: any) => any;
}, (status: number, res: ArrayBuffer[], headers: Headers, total: number) => RequestSuccessResult];
/**
 * @Author: sonion
 * @msg: 获取返回值类型
 * @param {'text'|'json'|'blob'|'arrayBuffer'} userResType - 用户指定的返回值类型
 * @param {string} resContentType - 响应头的contentType
 * @return {string}
 */
declare const getResponseType: (userResType: RequestOptions['resType'], resContentType?: string) => RequestOptions['resType'];
export { createResponseTypeHandle, getResponseType };
