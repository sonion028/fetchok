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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestParamsAfterHandle = void 0;
var util_1 = require("../util");
/**
 * @Author: sonion
 * @msg: 参数预处理完后，处理不涉及兼容性的参数处理
 * @param {string} url 请求地址
 * @param {object} options 请求参数 要求options.method处理完后调用
 * @param {function} isContentType - 判断contentType类型函数
 * @return {{url: string, options: object}} 返回GET状态下拼接完参数的url
 */
var requestParamsAfterHandle = function (url, options, validateContentType) {
    options = __assign({ method: "GET", timeout: 0, retryCount: 0, maxRetries: 0 }, options);
    options.method = options.method.toUpperCase(); // 防止强行传小写
    if (options.resType && !['text', 'json', 'blob', 'arrayBuffer'].includes(options.resType))
        delete options.resType; // 手动指定了，却不在选项中就删除
    var body; // 准备在非GET时用
    if ((0, util_1.getType)(options.body) === 'Object') {
        if (options.method === 'GET') {
            url += '?' + (0, util_1.toParams)(options.body); // get方式是在url链接后拼参数
            delete options.body;
        }
        else if (options.headers) {
            // post json格式 // post k=v用&的字符串拼接
            if (validateContentType(options.headers, 'application/json')) {
                body = JSON.stringify(options.body);
            }
            else if (validateContentType(options.headers, 'application/x-www-form-urlencoded')) {
                body = (0, util_1.toParams)(options.body);
            }
        }
    }
    else if (options.body)
        body = options.body; // body的处理
    return { url: url, options: __assign(__assign({}, options), { body: body }) };
};
exports.requestParamsAfterHandle = requestParamsAfterHandle;
