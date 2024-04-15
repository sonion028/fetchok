import type { OptionsBodyFirst, ParamOptions, IsContentType, RequestParamsHandleFunc } from "../../../types";
import { toParams, getType } from "../util";


/**
 * @Author: sonion
 * @msg: 参数预处理完后，处理不涉及兼容性的参数处理
 * @param {string} url 请求地址
 * @param {object} options 请求参数 要求options.method处理完后调用
 * @param {function} isContentType - 判断contentType类型函数
 * @return {{url: string, options: object}} 返回GET状态下拼接完参数的url
 */
const requestParamsAfterHandle = (
  url: string, options: ParamOptions, validateContentType: IsContentType
  ): ReturnType<RequestParamsHandleFunc> => {
  options = {
    method: "GET",
    timeout: 0, // 默认不限制超时时间
    retryCount: 0, // 已重试次数
    maxRetries: 0, // 最大重试次数 默认不重试
    ...options,
  };
  options.method = options.method.toUpperCase() as ParamOptions['method']; // 防止强行传小写
  if (options.resType && !['text', 'json', 'blob', 'arrayBuffer'].includes(options.resType)) delete options.resType; // 手动指定了，却不在选项中就删除
  let body: string; // 准备在非GET时用
  if (getType(options.body) === 'Object'){
    if (options.method === 'GET'){
      url += '?' + toParams(options.body as OptionsBodyFirst); // get方式是在url链接后拼参数
      delete options.body;
    }else if (options.headers){
      // post json格式 // post k=v用&的字符串拼接
      if (validateContentType(options.headers, 'application/json')){
        body = JSON.stringify(options.body)
      }else if (validateContentType(options.headers, 'application/x-www-form-urlencoded')){
        body = toParams(options.body as OptionsBodyFirst);
      }
    }
  }; // body的处理
  return {url, options: {...options, body} };
};




export {
  requestParamsAfterHandle,
}