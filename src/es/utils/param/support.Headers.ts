import type { IsContentType, RequestParamsHandleFunc } from '../../../types'
import { requestParamsAfterHandle } from "./generic.util";


/**
 * @Author: sonion
 * @msg: 判断content-type是否是某个值。如：application/json、application/x-www-form-urlencoded
 * @param {Headers} headers
 * @return {boolean}
 */
const _validateContentTypeMethod: IsContentType = (headers: Headers, contentType: string) => headers.get('Content-Type').startsWith(contentType);

/**
 * @Author: sonion
 * @msg: 根据参数对象中的method headers、body、url处理。Headers版在processing中有普通对象版
 * @param {string} url 请求地址
 * @param {object} options 请求参数 要求options.method处理完后调用
 * @return {{url: string, options: object}} 返回GET状态下拼接完参数的url
 */
const requestParamsHandle: RequestParamsHandleFunc = (url, options) => {
  if (options?.headers){
    options.headers = new Headers(options.headers as HeadersInit); // 利用Headers构造函数 和以忽略key写法不规范的问题
    // 不存在就设置默认Content-Type，不需要默认就注释这一句。
    options.headers.get('Content-Type') || options.headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
  }
  return requestParamsAfterHandle(url, options, _validateContentTypeMethod);
};


// 创建FormData函数类型
export type CreateFormDataFunc = (data: { [key: string]: string | [Blob | File, string] })=>FormData;

/**
 * @Author: sonion
 * @msg: 创建 FormData 数据
 * @param {object} data
 * @return {FormData}
 */
const createFormData: CreateFormDataFunc = (data)=>{
  const formData = new FormData();
  Object.entries(data).forEach(([key, val])=>{
    if (Array.isArray(val)){
      formData.append(key, ...val)
    }else {
      formData.append(key, val)
    }
  })
  return formData
}


export {
  createFormData,
  requestParamsHandle
}