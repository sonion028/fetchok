"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterceptorsPreset = void 0;
var authManger_1 = require("../utils/authManger");
var presetResponse_1 = require("./presetResponse");
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
var createInterceptorsPreset = function (storage, type) {
    if (storage === void 0) { storage = 'sessionStorage'; }
    if (type === void 0) { type = 'Bearer'; }
    var tokenManager = (0, authManger_1.createTokenManager)(storage, type);
    return __assign(__assign({ request: function (url, options) {
            if (options.headers instanceof Headers) {
                options.headers.set('Authorization', tokenManager.token || '');
            }
            else {
                options.headers = options.headers || {};
                options.headers.Authorization = tokenManager.token;
            }
            return [url, options];
        } }, (0, presetResponse_1.createResponsePreset)(function (_a) {
        var _b, _c, _d, _e, _f, _g;
        var status = _a.status, headers = _a.headers, resp = __rest(_a, ["status", "headers"]);
        var token, refreshToken;
        token = headers.get('Authorization');
        refreshToken = headers.get('refreshtoken');
        if ('data' in resp) {
            (token = token || ((_b = resp.data) === null || _b === void 0 ? void 0 : _b.token) || ((_d = (_c = resp.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.token)) && (tokenManager.token = token); // 存储token、refreshToken
            (refreshToken = refreshToken || ((_e = resp.data) === null || _e === void 0 ? void 0 : _e.refreshtoken) || ((_g = (_f = resp.data) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.refreshtoken)) && (tokenManager.refreshToken = refreshToken);
        }
    })), { tokenManager: tokenManager // 这不是拦截器。是tokenAuth对象，设置了拦截器可能还需要token，这里返回，外面解构就可以获取到
     });
};
exports.createInterceptorsPreset = createInterceptorsPreset;
// 用该封装的使用技巧 to myself。
// 1、本库不在乎Server返回格式，但推荐Server返回格（下文简称：推荐格式）式为 code: 状态代码{Number}, msg: 错误/成功消息{String}, data: 正常数据{any}。
// 2、文件、图片等blob类型，因不受Server影响，纯自己构造。就用格式: {code:0, data: blob}。
// 3、text、json类型，服务器可能就是"推荐格式"，再包一层不合适，所以统一按Server原始返回。推荐在项目中自己再用Promise或async再包一层，统一返回格式。
// 4、Client端错误全用throw抛到catch里。在项目中套一层的时候也推荐把Server返回的错误用throw抛到catch。
// 关于为什么不统一封装为"推荐格式" ？
// 是因为有的服务器返回就是"推荐格式"，再套一层code、msg、data没必要。有的返回又不是推荐格式。所以只能根据服务器返回，自己封装了。
