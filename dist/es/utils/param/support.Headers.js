"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestParamsHandle = void 0;
var generic_util_1 = require("./generic.util");
/**
 * @Author: sonion
 * @msg: 判断content-type是否是某个值。如：application/json、application/x-www-form-urlencoded
 * @param {Headers} headers
 * @return {boolean}
 */
var _validateContentTypeMethod = function (headers, contentType) { return headers.get("Content-Type").startsWith(contentType); };
/**
 * @Author: sonion
 * @msg: 根据参数对象中的method headers、body、url处理。Headers版在processing中有普通对象版
 * @param {string} url 请求地址
 * @param {object} options 请求参数 要求options.method处理完后调用
 * @return {{url: string, options: object}} 返回GET状态下拼接完参数的url
 */
var requestParamsHandle = function (url, options) {
    if (options === null || options === void 0 ? void 0 : options.headers) {
        options.headers = new Headers(options.headers); // 利用Headers构造函数 和以忽略key写法不规范的问题
        if (options.body instanceof FormData) {
            options.headers.delete("Content-Type");
        }
        else if (!options.headers.has("Content-Type")) {
            // 不存在就设置默认Content-Type，不需要默认就注释本分支
            options.headers.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        }
    }
    return (0, generic_util_1.requestParamsAfterHandle)(url, options, _validateContentTypeMethod);
};
exports.requestParamsHandle = requestParamsHandle;
