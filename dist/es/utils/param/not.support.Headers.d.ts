import { RequestOptions } from '../../../types';
type ValidateFunction = (key: string) => Boolean;
/**
 * @Author: sonion
 * @msg: 查找对象中的属性名（key）是否符合某个规则
 * @param {Record<string, unknown>} headers - 查找的普通对象 这里是普通对象格式的请求或响应头
 * @param {ValidateFunction[]} funcs - 用于判断key是否符合条件的函数数组
 * @return {Map<ValidateFunction, string>}
 */
declare const getObjectHeadersKey: (headers: Record<string, unknown>, funcs: ValidateFunction[]) => Map<ValidateFunction, string>;
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
