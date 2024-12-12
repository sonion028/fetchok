import type { RequestOptions, RequestSuccessResult } from '../../types';

// 动态决定是否导入自定义TextDecoder
(async ()=>{
  if (typeof TextDecoder === 'undefined'){
    const {MyTextDecoder} = await import('./textDecoder');
    // @ts-ignore
    globalThis.TextDecoder = MyTextDecoder
  }
})();


const createResponseTypeHandle = (total: number) =>{
  let offset = 0; // 当前offset // 也可以理解为mergedUint8Array当前的长度
  const mergedUint8Array = new Uint8Array(total) // 合并后的buffer
  // 把请求流式返回的每一段数据合并到mergedBuffer
  const setUint8Array = (item: Uint8Array)=>{
    mergedUint8Array.set(item, offset);
    offset += item.byteLength;
  }
  const resultHandler = (status: number, headers: Headers, responseType: RequestOptions['resType']): RequestSuccessResult=>{
    switch (responseType) {
      case 'text':
        const decoder = new TextDecoder('utf-8')
        return { status, data: decoder.decode(mergedUint8Array), headers }
      case 'json':
        const decoder2 = new TextDecoder('utf-8')
        return { status, data: JSON.parse(decoder2.decode(mergedUint8Array)), headers }
      case 'blob':
        return { status, data: new Blob([mergedUint8Array.buffer], { type: 'application/octet-stream' }), headers }
      case 'arrayBuffer':
        return { status, data: mergedUint8Array.buffer, headers }
      default:
        return { status, data: mergedUint8Array, headers }
    }
  }
  return [setUint8Array, resultHandler, ()=>offset] as const
}


  



/**
 * @Author: sonion
 * @msg: 获取返回值类型
 * @param {'text'|'json'|'blob'|'arrayBuffer'} userResType - 用户指定的返回值类型
 * @param {string} resContentType - 响应头的contentType
 * @return {string}
 */
const getResponseType = (userResType: RequestOptions['resType'], resContentType: string = ''): RequestOptions['resType']=>{
  if (userResType) return userResType
  else if (resContentType.startsWith("application/json")) return 'json'
  else if (resContentType.startsWith("text/")) return 'text'
  else return 'arrayBuffer';
}


export {
  createResponseTypeHandle,
  getResponseType
}