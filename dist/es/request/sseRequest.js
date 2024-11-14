"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSse = void 0;
var util_1 = require("../utils/util");
/**
 * @Author: sonion
 * @msg: sse请求。该请求基于事件，参数和request参数一样。返回一个事件对象，通过addEventListener注册事件处理函数接收返回值
 * @param {string} url 请求地址
 * @param {object} [options.body] - 请求参数，可选
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选
 * @param {function} [options.handle] - 事件message的处理函数，可选。也可以用返回值注册事件。
 * @return {EventSource}  EventSource对象，addEventListener注册message事件
 */
var requestSse = function (url, options) {
    if (options === void 0) { options = {}; }
    if (options.credentials && options.credentials === 'include')
        options.withCredentials = true;
    if (options.body)
        url += '?' + (0, util_1.toParams)(options.body); // 在url链接后拼参数
    var sse = new EventSource(url, options);
    if (options.handler)
        sse.addEventListener('message', options.handler); // 只能处理message的事件
    if (options.cancel || options.timeout) {
        options.cancel = options.cancel || {}; // 设置超时要借用取消，可能没有传cancel参数，就指定默认
        options.cancel.abort = function () { return sse.close(); };
    }
    options.timeout && setTimeout(options.cancel.abort, options.timeout); // 超时
    return sse;
};
exports.requestSse = requestSse;
