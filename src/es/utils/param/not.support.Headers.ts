import { RequestOptions, HeadersObject } from '../../../types'
import { contentTypeRegExp, contentLengthRegExp } from '../util'
import { requestParamsAfterHandle } from './generic.util'

/**
 * @Author: sonion
 * @msg: 获取content-type、content-length
 * @param {HeadersObject} headers - 普通对象headers
 * @return {*}
 */
const getObjectHeadersKey =(headers: HeadersObject): {contentType: string, contentLength: string}=>{
  const keyObj = {
    contentType: '',
    contentLength: ''
  }
  Object.keys(headers).forEach(originKeyName=>{
    contentTypeRegExp.test(originKeyName) && (keyObj.contentType = originKeyName);
    contentLengthRegExp.test(originKeyName) && (keyObj.contentLength = originKeyName)
  })
  return keyObj
}

/**
 * @Author: sonion
 * @msg: 判断普通对象中content-type是否是某个值。如：application/json、application/x-www-form-urlencoded
 * @return {boolean}
 */
const _validateContentTypeMethod = (headers: HeadersObject, contentType: string, keyName: string): boolean=>{
  if (headers[keyName]) return (headers[keyName] as string).startsWith(contentType);
  else false;
}
  
/**
 * @Author: sonion
 * @msg: 请求参数处理，适合不支持Headers的场景。如：微信小程序
 * @param {string} url - 请求url
 * @param {object} options - 请求参数
 * @return {object}
 */
const requestParamsHandle = (url: string, options: RequestOptions)=>{
  let _validateContentType
  if (options?.headers){
    const {contentType} = getObjectHeadersKey(options.headers as HeadersObject);
    // 没有就设置默认Content-Type，不需要默认就注释这一句。
    options.headers[contentType] || (options.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8');
    _validateContentType = (options, contentType):boolean=>_validateContentTypeMethod(options, contentType, contentType);
  }
  return requestParamsAfterHandle(url, options, _validateContentType)
}

export {
  getObjectHeadersKey, // 获取content-type、content-length
  requestParamsHandle // 不Headers直接导出成品函数
}