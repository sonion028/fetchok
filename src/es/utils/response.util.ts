import type { RequestOptions, RequestSuccessResult } from '../../types';

// 动态决定是否导入自定义TextDecoder
(async ()=>{
  if (typeof TextDecoder === 'undefined'){
    const {MyTextDecoder} = await import('./textDecoder');
    // @ts-ignore
    globalThis.TextDecoder = MyTextDecoder
  }
})();





/**
 * @Author: sonion
 * @msg: 将包含ArrayBuffer的数组合并为一个ArrayBuffer
 * @param {ArrayBuffer[]} res - 包含ArrayBuffer的数组
 * @param {number} total - 多个ArrayBuffer的总长度
 * @return {ArrayBuffer}
 */
const _mergedArrayBuffer = (res: ArrayBuffer[], total: number): ArrayBuffer=>{
  if (res?.length === 1) return res[0]
  const mergedBuffer = new Uint8Array(total);
  let offset = 0;
  res.forEach(item => {
    mergedBuffer.set(new Uint8Array(item), offset);
    offset += item.byteLength;
  });
  return mergedBuffer.buffer
}


// 返回值处理函数类型
type CreateResponseTypeHandle = (responseType: RequestOptions['resType'])=> [
  {decode: (any)=>any} | TextDecoder, 
  (status: number, res: ArrayBuffer[], headers: Headers, total: number)=>RequestSuccessResult
];

/**
 * @Author: sonion
 * @msg: 创建'json'、'text'、'blob'三种返回格式的处理函数。第一个是push前的Decoder对象，第二个是最终返回处理函数
 * @param {'json'|'text'|'blob'} responseType
 * @return {[object, function]}
 */
const createResponseTypeHandle = (responseType: RequestOptions['resType']): ReturnType<CreateResponseTypeHandle >=>{
  let decoder
  if (responseType === 'text' || responseType === 'json'){
    decoder = new TextDecoder('utf-8')
  }else{
    decoder = {decode: param => param} // fakeDecoder
  };
  
  if (responseType === 'text')return [
    decoder,
    (status, res, headers)=>({ status, data: res.join(''), headers })
  ];
  else if (responseType === 'json') return [
    decoder,
    (status, res, headers)=>({ status, data: JSON.parse(res.join('')), headers })
  ];
  else if (responseType === 'blob') return [
    decoder,
    // blob返回一个数组带上类型  其它不带，多传参数也不影响
    (status, res, headers, total)=> {
      let data: Blob | ArrayBuffer;
      if (typeof Blob === 'undefined') data = _mergedArrayBuffer(res, total)
      else data = new Blob(res as BlobPart[], { type: headers.get("content-type") });
      return ({ status, data, headers })
    }
  ];
  else return [ // arrayBuffer
    decoder,
    (status, res, headers, total)=>({ status, data: _mergedArrayBuffer(res, total), headers })
  ]; 
};

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