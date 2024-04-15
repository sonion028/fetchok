import type { RequestParamsHandleFunc } from '../../../types';
/**
 * @Author: sonion
 * @msg: 根据参数对象中的method headers、body、url处理。Headers版在processing中有普通对象版
 * @param {string} url 请求地址
 * @param {object} options 请求参数 要求options.method处理完后调用
 * @return {{url: string, options: object}} 返回GET状态下拼接完参数的url
 */
declare const requestParamsHandle: RequestParamsHandleFunc;
export type CreateFormDataFunc = (data: {
    [key: string]: string | [Blob | File, string];
}) => FormData;
/**
 * @Author: sonion
 * @msg: 创建 FormData 数据
 * @param {object} data
 * @return {FormData}
 */
declare const createFormData: CreateFormDataFunc;
export { createFormData, requestParamsHandle };
