import type { TokenManager } from "../../types";


// cookie对象类型
export type CookieStorage = {
  getItem: (key: string)=> string | null,
  setItem: (key: string, value: string, expires?: Date)=> boolean,
  removeItem: (key: string)=>string,
  clear: ()=> void
}

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
const cookie: CookieStorage = {
  /**
   * @Author: sonion
   * @msg: 读取cookie
   * @param {string} key cookie的key
   * @return {string|null} - 返回对应的值，没有就返回null
   */
  getItem: (key: string) => {
    for (const item of document.cookie.split("; ")) {
      const cookie = item.split("=");
      if (cookie[0] === key) return decodeURIComponent(cookie[1]);
    }
    return null;
  },
  /**
   * @Author: sonion
   * @msg: 写入cookie
   * @param {string} key cookie的key
   * @param {string} value cookie值
   * @param {date} [expires] 过期时间 - 不传会话结束就删除
   * @return {boolean} - 是否写入完成，true表示写入过程没有
   */
  setItem: (key, value, expires) => {
    try {
      let cookie = `${key}=${encodeURIComponent(value)}`;
      expires && (cookie += `; expires=${expires.toUTCString()}`);
      document.cookie = cookie;
      return true;
    } catch (err) {
      return false;
    }
  },
  /**
   * @Author: sonion
   * @msg: 移除cookie
   * @param {string} key cookie的key
   * @return {string}
   */
  removeItem: (key) =>(document.cookie = `${key}=; expires=${new Date(0).toUTCString()}`),
  /**
   * @Author: sonion
   * @msg: 清空cookie
   * @return {undefined}
   */  
  clear(){
    for (const item of document.cookie.split("; ")) {
      const cookie = item.split("=");
      this.removeItem(cookie[0])
    }
  }
}


// StoragMap 类型
type StoragMap = {
  localStorage: typeof localStorage,
  sessionStorage: typeof sessionStorage,
  cookie: CookieStorage,
}

// storageTag类型
export type StorageName = 'sessionStorage'|'localStorage'|'cookie';

// 创建token管理器函数类型
export type CreateTokenManagerFunc = (storage?: StorageName, type?: string)=>TokenManager

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
const createTokenManager: CreateTokenManagerFunc = (
  storageName = "sessionStorage" as StorageName,
  type = "Bearer" as string): TokenManager => {
  const storagMap: StoragMap = {
    localStorage,
    sessionStorage,
    cookie,
  };
  const storage = storagMap[storageName] || sessionStorage as typeof sessionStorage;
  return Object.defineProperties(
    {
      _regExp: new RegExp(`^${type}\\s+`), // 取出鉴权方法的正则
    } as TokenManager,
    {
      _token: {
        value: storage.getItem("token"),
        writable: true, // 可更改
        enumerable: false, // 不可以被枚举
        configurable: false, // 不可删除或重新配置
      },
      token: {
        get() {
          if (this._token) {
            return `${type} ${this._token}`;
          }
        },
        set(token) {
          if (token) {
            token = token.replace(this._regExp, ""); // 去除鉴权
            this._token = token;
            storage.setItem("token", token);
          }
        },
      },
      rawToken: {
        get() {
          if (this._token) return this._token;
        },
      },
      // 刷新token
      _refreshToken: {
        value: storage.getItem("refreshToken"),
        writable: true, // 可更改
        enumerable: false, // 不可以被枚举
        configurable: false, // 不可删除或重新配置
      },
      refreshToken: {
        get() {
          if (this._refreshToken) {
            return `${type} ${this._refreshToken}`;
          }
        },
        set(refreshToken) {
          if (refreshToken) {
            refreshToken = refreshToken.replace(this._regExp, ""); // 去除鉴权
            this._refreshToken = refreshToken;
            storage.setItem("refreshToken", refreshToken);
          }
        },
      },
      rawRefreshToken: {
        get() {
          if (this._refreshToken) return this._refreshToken;
        },
      },
    }
  );
};

export {
  cookie,
  createTokenManager
}