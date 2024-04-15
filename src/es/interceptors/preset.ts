import type { InterceptorsObject } from '../../types';
import { StorageName } from '../utils/authManger'
import { createTokenManager } from '../utils/authManger';
import { createResponsePreset } from './responsePreset';


// 拦截器
export type Interceptors = Required<Omit<InterceptorsObject, 'finally'>>;

// 拦截器预设
export type CreateInterceptorsPreset = (storage?: StorageName, type?: string) => Interceptors

/**
 * @Author: sonion
 * @msg: 拦截器预设
 * @param {'sessionStorage'|'localStorage'|'cookie'} [storage='sessionStorage'] 储存token的位置
 * @param {string} [type='Bearer'] 认证类型
 * @return { { 
 * request: (url: string, options?: object)=>{url: string, options?: object}, 
 * response: (res: any)=>any, 
 * catch: (err: Error)=>undefined, 
 * tokenManager: {token: string, rawToken: string, refreshToken: string, rawRefreshToken: string} 
 * } }
 * @property {Function} request - 请求拦截器
 * @property {Function} response - 响应拦截器
 * @property {Function} catch - 错误拦截器
 * @property {Object} tokenAuth - 使用token管理器，同createTokenAuth返回
 */
const createInterceptorsPreset: CreateInterceptorsPreset = (storage: StorageName = 'sessionStorage', type: string = 'Bearer'): Interceptors=>{
  const tokenManager: ReturnType<typeof createTokenManager> = createTokenManager(storage, type);
  return {
    request: (url, options)=>{
      if (options.headers instanceof Headers) {
        options.headers.set('Authorization', tokenManager.token || '');
      } else {
        options.headers = options.headers || {};
        options.headers.Authorization = tokenManager.token;
      }
      return [url, options]
    },
    // 响应拦截器
    // data: res, msg
    ...createResponsePreset(({status, headers, ...resp })=>{
      let token: string, refreshToken: string;
      token = headers.get('Authorization');
      refreshToken = headers.get('refreshtoken');
      if ('data' in resp){
        (token = token || resp.data?.token || resp.data?.data?.token) && (tokenManager.token = token); // 存储token、refreshToken
        (refreshToken = refreshToken ||resp.data?.refreshtoken || resp.data?.data?.refreshtoken) && (tokenManager.refreshToken = refreshToken);
      }
    }),
    tokenManager // 这不是拦截器。是tokenAuth对象，设置了拦截器可能还需要token，这里返回，外面解构就可以获取到
  }
}

export {
  createInterceptorsPreset // 拦截器预设
}




// 用该封装的使用技巧 to myself。
// 1、本库不在乎Server返回格式，但推荐Server返回格（下文简称：推荐格式）式为 code: 状态代码{Number}, msg: 错误/成功消息{String}, data: 正常数据{any}。
// 2、文件、图片等blob类型，因不受Server影响，纯自己构造。就用格式: {code:0, data: blob}。
// 3、text、json类型，服务器可能就是"推荐格式"，再包一层不合适，所以统一按Server原始返回。推荐在项目中自己再用Promise或async再包一层，统一返回格式。
// 4、Client端错误全用throw抛到catch里。在项目中套一层的时候也推荐把Server返回的错误用throw抛到catch。
// 关于为什么不统一封装为"推荐格式" ？
// 是因为有的服务器返回就是"推荐格式"，再套一层code、msg、data没必要。有的返回又不是推荐格式。所以只能根据服务器返回，自己封装了。