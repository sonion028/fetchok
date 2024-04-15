import type { RequestSuccessResult, RequestFailedResult, Interceptor } from '../../types';
export type RequestSuccessCallback = (res: RequestSuccessResult | RequestFailedResult) => any;
export type RespInterceptors = Required<Omit<Interceptor, 'request' | 'finally' | 'tokenManager'>>;
export type CreateRespInterceptorsPreset = typeof createResponsePreset;
/**
 * @Author: sonion
 * @msg: 创建响应拦截器预设
 * @param {RequestSuccessCallback} [callback] - 可以传一个函数，会传入响应值。会返回该函数返回值，如没有则返回服务端响应值
 * @return {RespInterceptors}
 */
declare const createResponsePreset: (callback?: RequestSuccessCallback) => RespInterceptors;
export { createResponsePreset };
