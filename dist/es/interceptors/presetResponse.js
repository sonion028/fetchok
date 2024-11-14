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
exports.createResponsePreset = void 0;
var util_1 = require("../utils/util");
/**
 * @Author: sonion
 * @msg: 创建响应拦截器预设
 * @param {RequestSuccessCallback} [callback] - 可以传一个函数，会传入响应值。会返回该函数返回值，如没有则返回服务端响应值
 * @return {RespInterceptors}
 */
var createResponsePreset = function (callback) {
    return {
        // 响应拦截器，利用解构
        response: function (_a) {
            var _b, _c, _d;
            var status = _a.status, headers = _a.headers, resp = __rest(_a, ["status", "headers"]);
            // 错误抛到catch中处理
            var newRes = callback && callback(__assign({ status: status, headers: headers }, resp));
            if (status < 200 || status >= 300)
                throw { code: -1, msg: (resp === null || resp === void 0 ? void 0 : resp.msg) || ((_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.msg) || '网络请求错误' };
            if ('data' in resp && (0, util_1.getType)(resp.data) === 'Object' && (((_c = resp.data) === null || _c === void 0 ? void 0 : _c.code) || !((_d = resp.data) === null || _d === void 0 ? void 0 : _d.data)))
                throw resp.data;
            // 服务器返回：code不为0、null、undefined， 且没有data属性的抛出错误，在后续catch里处理
            return newRes || resp.data; // 服务器返回：code为0、null、undefined，或有data属性的在后续then里处理
        },
        catch: function (err) {
            // 统一错误格式后 再抛到外层。
            throw __assign({ code: -1, msg: err.message }, err); // Client端err对象中的其他属性会合并进来（推荐）
            // throw { code: err.code || -1, msg: err.msg || err.message }; // Server端code、msg外的属性可能丢失（不推荐）
            // throw err.code && err.msg ? err : { code: -1, msg: err.message } // Server端属性不会丢失，Client端多余属性也不会合并（完美，但写法丑）
        }
    };
};
exports.createResponsePreset = createResponsePreset;
