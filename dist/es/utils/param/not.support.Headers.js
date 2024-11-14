"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestParamsHandle = exports.getObjectHeadersKey = void 0;
var util_1 = require("../util");
var generic_util_1 = require("./generic.util");
/**
 * @Author: sonion
 * @msg: 查找对象中的属性名（key）是否符合某个规则
 * @param {Record<string, unknown>} headers - 查找的普通对象 这里是普通对象格式的请求或响应头
 * @param {ValidateFunction[]} funcs - 用于判断key是否符合条件的函数数组
 * @return {Map<ValidateFunction, string>}
 */
var getObjectHeadersKey = function (headers, funcs) {
    var keyMap = new Map();
    Object.keys(headers).forEach(function (originKeyName) {
        funcs.forEach(function (fn) { return fn(originKeyName) && keyMap.set(fn, originKeyName); });
    });
    return keyMap;
};
exports.getObjectHeadersKey = getObjectHeadersKey;
/**
 * @Author: sonion
 * @msg: 判断普通对象中的指定属性是否某个值开头。 如：content-type 是不是，但又忽略其后可能的别的参数 application/json、application/x-www-form-urlencoded
 * @param {HeadersObject} headers - 目标对象
 *  * @param {string} key - 判断的属性名
 * @param {string} val - 要以xxx开头的这个值 也就是属性值
 * @return {boolean}
 */
var _validateObjectValueStartWithMethod = function (headers, key, val) {
    return headers[key] ? headers[key].startsWith(val) : false;
};
/**
 * @Author: sonion
 * @msg: 请求参数处理，适合不支持Headers的场景。如：微信小程序
 * @param {string} url - 请求url
 * @param {object} options - 请求参数
 * @return {object}
 */
var requestParamsHandle = function (url, options) {
    var _validateContentType;
    if (options === null || options === void 0 ? void 0 : options.headers) {
        var isContentType = function (key) { return util_1.contentTypeRegExp.test(key); }; // 判断是否是contentType的函数
        var keyMap = getObjectHeadersKey(options.headers, [
            isContentType,
        ]);
        var contentTypeKey_1 = keyMap.get(isContentType);
        // 没有就设置默认Content-Type，不需要默认就注释这一句。
        if (options.body instanceof FormData) {
            Reflect.deleteProperty(options.headers, contentTypeKey_1);
        }
        else if (!options.headers[contentTypeKey_1]) {
            // 没有就设置默认Content-Type，不需要默认就注释本分支
            options.headers["Content-Type"] =
                "application/x-www-form-urlencoded;charset=utf-8";
        }
        _validateContentType = function (options, contentTypeVal) {
            return _validateObjectValueStartWithMethod(options, contentTypeKey_1, contentTypeVal);
        };
    }
    return (0, generic_util_1.requestParamsAfterHandle)(url, options, _validateContentType);
};
exports.requestParamsHandle = requestParamsHandle;
