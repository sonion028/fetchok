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
 * @return { CookieStorage }
 * @property { CookieStorage['getItem'] } getItem - 获取key对应的cookie
 * @property { CookieStorage['setItem'] } setItem - 写入cookie
 * @property { CookieStorage['removeItem'] } removeItem - 移除cookie
 * @property { CookieStorage['clear'] } clear - 清空cookie
 */
declare const cookie: CookieStorage;
export type StorageName = 'sessionStorage' | 'localStorage' | 'cookie';
export type CreateTokenManagerFunc = (storage?: StorageName, type?: string) => TokenManager;
/**
 * @Author: sonion
 * @msg: 创建token鉴权对象
 * @param {'sessionStorage'|'localStorage'|'cookie'} [storageName='sessionStorage'] 储存token的位置
 * @param {string} [type='Bearer'] 认证类型
 * @return { TokenManager } 返回token、refreshToken等属性的对象
 * @property token - 拼接有鉴权方法（type）的token
 * @property rawToken - 原始token
 * @property refreshToken - 拼接有鉴权方法（type）的刷新token
 * @property rawRefreshToken - 原始刷新token
 */
declare const createTokenManager: CreateTokenManagerFunc;
export { cookie, createTokenManager };
