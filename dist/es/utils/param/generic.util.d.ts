import type { RequestOptions, IsContentType, RequestParamsHandleFunc } from "../../../types";
/**
 * @Author: sonion
 * @msg: 参数预处理完后，处理不涉及兼容性的参数处理
 * @param {string} url 请求地址
 * @param {object} options 请求参数 要求options.method处理完后调用
 * @param {function} isContentType - 判断contentType类型函数
 * @return {{url: string, options: object}} 返回GET状态下拼接完参数的url
 */
declare const requestParamsAfterHandle: (url: string, options: RequestOptions, validateContentType: IsContentType) => ReturnType<RequestParamsHandleFunc>;
export { requestParamsAfterHandle, };
