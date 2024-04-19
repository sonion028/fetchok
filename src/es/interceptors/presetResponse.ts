import type { RequestSuccessResult, RequestFailedResult, CustomError, Interceptor } from '../../types';
import { getType } from '../utils/util'


// 请求成功的响应拦截器callback 设置参数可能用到
export type RequestSuccessCallback = (res: RequestSuccessResult | RequestFailedResult)=>any;
// 响应拦截器
export type RespInterceptors = Required<Omit<Interceptor, 'request' | 'finally' | 'tokenManager'>>
// 创建响应拦截器函数类型
export type CreateRespInterceptorsPreset = typeof createResponsePreset;

/**
 * @Author: sonion
 * @msg: 创建响应拦截器预设
 * @param {RequestSuccessCallback} [callback] - 可以传一个函数，会传入响应值。会返回该函数返回值，如没有则返回服务端响应值
 * @return {RespInterceptors}
 */
const createResponsePreset = (callback?: RequestSuccessCallback ): RespInterceptors=>{
  return {
    // 响应拦截器，利用解构
    response: ({ status, headers, ...resp }: RequestSuccessResult | RequestFailedResult)=>{
      // 错误抛到catch中处理
      const newRes = callback && callback({status, headers, ...resp})
      if (status < 200 || status >= 300) throw {code: -1, msg: (resp as RequestFailedResult)?.msg || (resp as RequestSuccessResult)?.data?.msg || '网络请求错误'};
      if ('data' in resp && getType(resp.data) === 'Object' && (resp.data?.code || !resp.data?.data)) throw resp.data; 
      // 服务器返回：code不为0、null、undefined， 且没有data属性的抛出错误，在后续catch里处理
      return newRes || (resp as RequestSuccessResult).data; // 服务器返回：code为0、null、undefined，或有data属性的在后续then里处理
    },
    catch: (err: CustomError)=>{
      // 统一错误格式后 再抛到外层。
      throw { code: -1, msg: (err as CustomError).message, ...err }; // Client端err对象中的其他属性会合并进来（推荐）
      // throw { code: err.code || -1, msg: err.msg || err.message }; // Server端code、msg外的属性可能丢失（不推荐）
      // throw err.code && err.msg ? err : { code: -1, msg: err.message } // Server端属性不会丢失，Client端多余属性也不会合并（完美，但写法丑）
    }
  }
}

export {
  createResponsePreset
}