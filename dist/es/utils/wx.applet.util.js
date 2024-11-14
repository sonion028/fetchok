"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisic = void 0;
/**
 * @Author: sonion
 * @msg: 将微信小程序API中不支持Promise的简单转换为支持Promise的方式
 * @param {Function} func - 微信小程序API
 * @return {Function} 返回用Promise封装后的微信API
 */
var promisic = function (func) {
    return function (args) {
        if (args === void 0) { args = {}; }
        return new Promise(function (resolve, reject) {
            args.success = function (res) {
                resolve(res);
            };
            args.fail = function (err) {
                reject(err);
            };
            func(args);
        });
    };
};
exports.promisic = promisic;
