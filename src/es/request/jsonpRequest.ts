import type { MyOmit, RequestOptions, OptionsBodyFirst } from '../../types'
import { toParams } from "../utils/util"

// jsonp请求参数
export type RequestOptionsJsonp =  MyOmit<RequestOptions, 'method' | 'headers' | 'body' | 'onProgress' | 'resType' | 'maxRetries' | 'signal'> & {
  body: OptionsBodyFirst,
  callbackNameProperty?: string, 
  callbackName?: string
}

// jsonp请求函数类型
export type RequestorJsonp = (
  url: String,
  options?: RequestOptionsJsonp
  ) =>Promise<unknown>;

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

const requestJsonp: RequestorJsonp = (
  url: string, 
  options = {callbackNameProperty: 'callback'} as RequestOptionsJsonp
  ): ReturnType<RequestorJsonp>=>{
  options.callbackName = options.callbackName || '__' + (Math.random() * 100000000000 + 100000000000).toString(32).replaceAll('.', '_'); // 随机函数名
  let tag = document.createElement('script');
  tag.type = "text/javascript";
  if (options.cancel || options.timeout){
    options.cancel = options.cancel || {}; // 设置超时要借用取消，可能没有传cancel参数，就指定默认
    options.cancel.abort = ()=>{
      delete window[options.callbackName];
      tag.remove();
      tag = null;
    };
  }
  options.timeout && setTimeout(options.cancel.abort, options.timeout) // 超时
  return new Promise((resolve, reject)=>{
    try {
      window[options.callbackName] = resolve;
      tag.src = `${ url }?${ options.callbackNameProperty || 'callback' }=${ options.callbackName }`;
      if (options.body) tag.src + '&' + toParams(options.body);
      document.head.appendChild(tag)
    } catch (error) {
      reject(error);
    }
  }).finally(()=>{
    delete window[options.callbackName];
    tag.remove();
    tag = null;
  })
}


// 创建请求函数的类型
export type CreateRequestorJsonp = ()=>RequestorJsonp;

/**
 * @Author: sonion
 * @msg: 对于通过referrer判断的接口。通过该方法创建不受影响的jsonp请求方法
 * @return {RequestorJsonp}
 */
const createJsonp: CreateRequestorJsonp = (): RequestorJsonp=>{
  const meta = document.createElement('meta');
  meta.name = 'referrer';
	meta.content = 'no-referrer';
	document.head.appendChild(meta);
  return requestJsonp
}


export {
  requestJsonp,
  createJsonp
}