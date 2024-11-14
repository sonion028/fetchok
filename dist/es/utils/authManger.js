"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenManager = exports.cookie = void 0;
/**
 * @Author: sonion
 * @msg: cookie操作对象
 * @return { CookieStorage }
 * @property { CookieStorage['getItem'] } getItem - 获取key对应的cookie
 * @property { CookieStorage['setItem'] } setItem - 写入cookie
 * @property { CookieStorage['removeItem'] } removeItem - 移除cookie
 * @property { CookieStorage['clear'] } clear - 清空cookie
 */
var cookie = {
    /**
     * @Author: sonion
     * @msg: 读取cookie
     * @param {string} key cookie的key
     * @return {string|null} - 返回对应的值，没有就返回null
     */
    getItem: function (key) {
        for (var _i = 0, _a = document.cookie.split("; "); _i < _a.length; _i++) {
            var item = _a[_i];
            var cookie_1 = item.split("=");
            if (cookie_1[0] === key)
                return decodeURIComponent(cookie_1[1]);
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
    setItem: function (key, value, expires) {
        try {
            var cookie_2 = "".concat(key, "=").concat(encodeURIComponent(value));
            expires && (cookie_2 += "; expires=".concat(expires.toUTCString()));
            document.cookie = cookie_2;
            return true;
        }
        catch (err) {
            return false;
        }
    },
    /**
     * @Author: sonion
     * @msg: 移除cookie
     * @param {string} key cookie的key
     * @return {string}
     */
    removeItem: function (key) { return (document.cookie = "".concat(key, "=; expires=").concat(new Date(0).toUTCString())); },
    /**
     * @Author: sonion
     * @msg: 清空cookie
     * @return {undefined}
     */
    clear: function () {
        for (var _i = 0, _a = document.cookie.split("; "); _i < _a.length; _i++) {
            var item = _a[_i];
            var cookie_3 = item.split("=");
            this.removeItem(cookie_3[0]);
        }
    }
};
exports.cookie = cookie;
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
var createTokenManager = function (storageName, type) {
    if (storageName === void 0) { storageName = "sessionStorage"; }
    if (type === void 0) { type = "Bearer"; }
    var storagMap = {
        localStorage: localStorage,
        sessionStorage: sessionStorage,
        cookie: cookie,
    };
    var storage = storagMap[storageName] || sessionStorage;
    return Object.defineProperties({
        _regExp: new RegExp("^".concat(type, "\\s+")), // 取出鉴权方法的正则
    }, {
        _token: {
            value: storage.getItem("token"),
            writable: true, // 可更改
            enumerable: false, // 不可以被枚举
            configurable: false, // 不可删除或重新配置
        },
        token: {
            get: function () {
                if (this._token) {
                    return "".concat(type, " ").concat(this._token);
                }
            },
            set: function (token) {
                if (token) {
                    token = token.replace(this._regExp, ""); // 去除鉴权
                    this._token = token;
                    storage.setItem("token", token);
                }
            },
        },
        rawToken: {
            get: function () {
                if (this._token)
                    return this._token;
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
            get: function () {
                if (this._refreshToken) {
                    return "".concat(type, " ").concat(this._refreshToken);
                }
            },
            set: function (refreshToken) {
                if (refreshToken) {
                    refreshToken = refreshToken.replace(this._regExp, ""); // 去除鉴权
                    this._refreshToken = refreshToken;
                    storage.setItem("refreshToken", refreshToken);
                }
            },
        },
        rawRefreshToken: {
            get: function () {
                if (this._refreshToken)
                    return this._refreshToken;
            },
        },
    });
};
exports.createTokenManager = createTokenManager;
