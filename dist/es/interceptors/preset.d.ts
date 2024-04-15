import type { Interceptor, TokenManager } from '../../types';
import { StorageName } from '../utils/authManger';
export type CreateInterceptorsPreset = typeof createInterceptorsPreset;
export type PresetInterceptor = Required<Omit<Interceptor, 'finally'>> & {
    tokenManager: TokenManager;
};
/**
 * @Author: sonion
 * @msg: 拦截器预设
 * @param {'sessionStorage'|'localStorage'|'cookie'} [storage='sessionStorage'] 储存token的位置
 * @param {string} [type='Bearer'] 认证类型
 * @return { PresetInterceptor }
 * @property { PresetInterceptor['request'] } request - 请求拦截器
 * @property { PresetInterceptor['response'] } response - 响应拦截器
 * @property { PresetInterceptor['catch'] } catch - 错误拦截器
 * @property { PresetInterceptor['tokenManager'] } tokenAuth - 使用token管理器，同createTokenAuth返回
 */
declare const createInterceptorsPreset: (storage?: StorageName, type?: string) => PresetInterceptor;
export { createInterceptorsPreset };
