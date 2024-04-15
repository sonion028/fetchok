import type { 
  ParamOptions, ProcessedOptions, ProcessedOptionsPlusUrl, HeadersObject,
  RequestMainFunc,RequestFunc, RequestPromiseReturned, InterceptorsObject,
} from '../../types'
import { createInterceptor } from '../interceptors/create';
import { requestParamsHandle, getObjectHeadersKey } from '../utils/param/not.support.Headers'
import { _requestRetry } from '../utils/retry.util'
// 创建各类型响应处理函数
import { createResponseTypeHandle, getResponseType } from '../utils/response.util'


// 是否允许进度，小程序bug可能丢失进度。
const ALLOW_PROGRESS = (()=>{
  const _keyName = 'ALLOW_PROGRESS';
  return Object.defineProperties({
    get allow(){
      return this._allow
    },
    set allow(val){
      this._allow = val;
      wx.setStorageSync(_keyName, val)
    }
  }, {
    _allow: {
      value: wx.getStorageSync(_keyName) || true,
      writable: true, // 可更改
      enumerable: false, // 不可以被枚举
      configurable: false, // 不可删除或重新配置
    }
  })
})();


/**
 * @Author: sonion
 * @msg: 处理未解码的部分，并合并到解码后的
 * @param {object} resVal
 * @return {object} 返回处理后的对象
 */
const _handlePending = (resVal)=>{
  resVal.pending.length && (resVal.responseBody = resVal.pending.map(item=>resVal.responseDecoder.decode(item)).concat(resVal.responseBody));
  delete resVal.pending
  return resVal
}

// 微信小程序命名空间
declare namespace wx {
  interface RequestResult {
    // 监听
    onHeadersReceived: (callback: (headers: {header: Object, statusCode: number}) => void) => void;
    onChunkReceived: (callback: (chunck: {data: ArrayBuffer}) => void) => void;
    // 取消监听
    offHeadersReceived: (callback?: (headers: {header: Object, statusCode: number}) => void) => void;
    offChunkReceived: (callback?: (chunck: {data: ArrayBuffer}) => void) => void;
    abort: ()=>void
  }
  function request(options: ParamOptions): RequestResult;
  function getStorageSync(key: string): unknown;
  function setStorageSync(key: string, data: unknown): unknown
}

/**
 * @Author: sonion
 * @msg: 微信小程序请求封装
 * @param {CustomOptions} options
 * @return {Promise<unknown>}
 */
const _request = ({url, headers, body, cancel, onProgress, resType, ...options}: ProcessedOptionsPlusUrl): ReturnType<RequestMainFunc>=>{
  let requestTask: wx.RequestResult
  return new Promise((resolve, reject)=>{
    // 这个对象流式返回才需要
    const resValue = {
      total: 0, // 总长度
      pending: [], // 未解码的 arrayBuffer
      responseBody: [], // 解码后的 arrayBuffer
      status: undefined, // 请求状态。用了流式返回success里就没有了
      headers: undefined, // 响应头。用了流式返回success里就没有了
      responseDecoder: undefined, // 解码器
      resultHandler: undefined, // 返回处理函数
    }
    // 下面才是请求参数
    options.url = url;
    options.header = headers;
    options.data = body;
    // 响应值类型
    if (resType === 'json' ) options.dataType = 'json'; 
    else if (resType === 'blob') options.responseType = 'arraybuffer';
    else options.responseType = 'text';
    options.success = ({ statusCode: status, data, header: headers }) => {
      if (options.enableChunked){
        resValue.pending.length && _handlePending(resValue);
        if (!resValue.responseBody.length){
          ALLOW_PROGRESS.allow = false; // 不允许进度
          reject({ code: 600098, msg: '用了进度，onChunkReceived没有触发。该bug，需向微信反馈' })
          return
        }
        resolve(resValue.resultHandler(resValue.status, resValue.responseBody, new Map(Object.entries(resValue.headers)), resValue.total));
      } else resolve({status, headers: new Map(Object.entries(headers)), data });
    }; // json是否自动反序列化，需验证
    options.fail = ({ errno: code, errMsg: msg, }) => reject({ code: code || -1, msg });
    ALLOW_PROGRESS.allow && onProgress && (options.enableChunked = true); // 要进度就开流式传输
    requestTask = wx.request(options);
    // 手动取消
    cancel && (cancel.abort = ()=>{
      requestTask.abort();
      cancel.isCancelled = true; // 表示已手动取消
      // 避免abort失效, 直接中断Promise
      reject({ code: 600099, msg: '手动取消' }); // code根据微信的erron规则编的
    });
    // 响应进度
    
    if (options.enableChunked){
      let loaded = 0,total = 0; // total只用于判断是否调用onProgress，因响应头可能无Content-Length字段
      // 获取响应头中的总大小
      requestTask.onHeadersReceived(({header, statusCode: status})=>{
        if (status !== 200) {
          resolve({ status, headers: header, msg: '网络请求失败'})
          return;
        }
        resValue.status = status;
        resValue.headers = header;
        const {contentLength, contentType} = getObjectHeadersKey(header as HeadersObject); // 获取contentLength、contentType真是名字
        total = resValue.total = (+ header[contentLength] || resValue.total); // 获取
        const responseType = getResponseType(resType, header[contentType]); // 获取返回值类型
        ([resValue.responseDecoder, resValue.resultHandler] = createResponseTypeHandle(responseType)); // 创建每一部分返回和最终返回处理函数
      });
      // 根据收到的每个人chunk 调响应进度函数
      requestTask.onChunkReceived(({data})=>{
        if (resValue.responseDecoder) resValue.responseBody.push(resValue.responseDecoder.decode(data)); // blob直接放入数组，否则解码后放入数组
        else resValue.pending.push(data);
        total && onProgress(loaded += data.byteLength, resValue.total);
        resValue.total = resValue.total > loaded ? resValue.total : loaded; // 如无contentLength，用blob、arrayBuffer导致无法合并。所以保底设置一个
      });
    }
  }).finally(()=>{
    if (requestTask){
      requestTask.offChunkReceived();
      requestTask.offHeadersReceived();
    }
  }) as ReturnType<RequestMainFunc>
}


/**
 * @Author: sonion
 * @msg: wx.request 请求基础封装
 * @param {string} url - 请求地址
 * @param {object} [options] - 请求的选项参数，可选
 * @param {string} [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param {object} [options.headers={}] - 请求头，可选，默认为空对象
 * @param {object} [options.body] - 请求体，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选，默认为0(xhr不限制)
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param {'text'|'json'|'blob'|'arrayBuffer'} [options.resType] - 手动设置返回类型，可选。blob必须手动指定
 * @param {function} [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return {Promise} 返回Promise<{status: number, data: Blob, msg: string, headers: Headers}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在改属性。
 * @property [msg] - 提示信息。没有出错一般没有改属性
 */
const request: RequestFunc = (url: string, options?: ParamOptions): RequestPromiseReturned=>{
  let processedParams: ProcessedOptions;
  ({ url, options: processedParams } = requestParamsHandle(url, options)); // ts 不能直接赋值原 options 变量
  processedParams.url = url; // 合并url到请求参数中，在公共_requestRetry中好处理

  if (ALLOW_PROGRESS.allow && processedParams.maxRetries === 0){
    processedParams.maxRetries = 1; // 为应对小程序bug，设置一次重试
  }else if (!ALLOW_PROGRESS.allow && processedParams.onProgress) {
    delete processedParams.onProgress;
  }
  return _requestRetry(processedParams, _request); // 正式请求开始
}


/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的 wx.request 请求
 * @param {object} interceptors - 拦截器对象
 * @param {function} [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param {function} [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param {function} [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param {function} [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return {function} 返回使用了拦截器的请求函数。参数和requestXhr方法一样。
 */
request.create = (interceptors = {} as InterceptorsObject)=>{
  return createInterceptor.call(request, interceptors)
};


export {
  request
}