import type { InterceptorsObject } from '../../types';
import { StorageName } from '../utils/authManger';
export type Interceptors = Required<Omit<InterceptorsObject, 'finally'>>;
export type CreateInterceptorsPreset = (storage?: StorageName, type?: string) => Interceptors;
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
declare const createInterceptorsPreset: CreateInterceptorsPreset;
export { createInterceptorsPreset };
