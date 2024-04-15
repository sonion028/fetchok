import type { TokenManager } from "../../types";
export type CookieStorage = {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string, expires?: Date) => boolean;
    removeItem: (key: string) => string;
    clear: () => void;
};
/**
 * @Author: sonion
 * @msg: cookie操作对象
 * @return {{
 *  getItem: (key: string)=>string,
 *  setItem: (key: string, value: string, expires?: Date)=>Boolean,
 *  removeItem: (key: string)=>string,
 *  clear: ()=>undefined
 * }}
 * @property {Function} getItem - 获取key对应的cookie
 * @property {Function} setItem - 写入cookie
 * @property {Function} removeItem - 移除cookie
 * @property {Function} clear - 清空cookie
 */
declare const cookie: CookieStorage;
export type StorageName = 'sessionStorage' | 'localStorage' | 'cookie';
export type CreateTokenManagerFunc = (storage?: StorageName, type?: string) => TokenManager;
/**
 * @Author: sonion
 * @msg: 创建token鉴权对象
 * @param {'sessionStorage'|'localStorage'|'cookie'} [storageName='sessionStorage'] 储存token的位置
 * @param {string} [type='Bearer'] 认证类型
 * @return {{ token: string, rawToken: string, refreshToken: string, rawRefreshToken: string }} 返回token、refreshToken等属性的对象
 * @property token - 拼接有鉴权方法（type）的token
 * @property rawToken - 原始token
 * @property refreshToken - 拼接有鉴权方法（type）的刷新token
 * @property rawRefreshToken - 原始刷新token
 */
declare const createTokenManager: CreateTokenManagerFunc;
export { cookie, createTokenManager };
