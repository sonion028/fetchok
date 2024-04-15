import type { RequestSuccessResult, RequestFailedResult, InterceptorsObject } from '../../types';
export type RequestSuccessCallback = (res: RequestSuccessResult | RequestFailedResult) => any;
export type RespInterceptors = Required<Omit<InterceptorsObject, 'request' | 'finally' | 'tokenManager'>>;
export type CreateRespInterceptorsPreset = (callback?: RequestSuccessCallback) => RespInterceptors;
/**
 * @Author: sonion
 * @msg: 创建响应拦截器预设
 * @param {function} [callback] - 可以传一个函数，会传入响应值。会返回该函数返回值，如没有则返回服务端响应值
 * @return {any}
 */
declare const createResponsePreset: CreateRespInterceptorsPreset;
export { createResponsePreset };
