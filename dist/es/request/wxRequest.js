"use strict";
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
exports.request = void 0;
var create_1 = require("../interceptors/create");
var not_support_Headers_1 = require("../utils/param/not.support.Headers");
var util_1 = require("../utils/util"); // 匹配contentType、contentLength的正则表达式
var retry_util_1 = require("../utils/retry.util");
// 创建各类型响应处理函数
var response_util_1 = require("../utils/response.util");
// 是否允许进度，小程序bug可能丢失进度。
var ALLOW_PROGRESS = (function () {
    var _keyName = 'ALLOW_PROGRESS';
    return Object.defineProperties({
        get allow() {
            return this._allow;
        },
        set allow(val) {
            this._allow = val;
            wx.setStorageSync(_keyName, val);
        }
    }, {
        _allow: {
            value: wx.getStorageSync(_keyName) || true,
            writable: true, // 可更改
            enumerable: false, // 不可以被枚举
            configurable: false, // 不可删除或重新配置
        }
    });
})();
/**
 * @Author: sonion
 * @msg: 处理未解码的部分，并合并到解码后的
 * @param {object} resVal
 * @return {object} 返回处理后的对象
 */
var _handlePending = function (resVal) {
    resVal.pending.length && (resVal.responseBody = resVal.pending.map(function (item) { return resVal.responseDecoder.decode(item); }).concat(resVal.responseBody));
    delete resVal.pending;
    return resVal;
};
/**
 * @Author: sonion
 * @msg: 微信小程序请求封装
 * @param { RequestOptions } options - 请求参数对象
 * @param {string} options.url - 请求地址
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { Pick<RequestOptions['headers'], 'Headers'> } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选。默认为0(xhr不限制)
 * @param { RequestOptions['cancel'] } [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param { RequestOptions['resType'] } [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param { RequestOptions['onProgress'] } [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return { RequestPromiseReturned } 返回Promise<{status: number, headers: Headers, data: any}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 */
var _request = function (_a) {
    var url = _a.url, headers = _a.headers, body = _a.body, cancel = _a.cancel, onProgress = _a.onProgress, resType = _a.resType, options = __rest(_a, ["url", "headers", "body", "cancel", "onProgress", "resType"]);
    var requestTask;
    return new Promise(function (resolve, reject) {
        // 这个对象流式返回才需要
        var resValue = {
            total: 0, // 总长度
            pending: [], // 未解码的 arrayBuffer
            responseBody: [], // 解码后的 arrayBuffer
            status: undefined, // 请求状态。用了流式返回success里就没有了
            headers: undefined, // 响应头。用了流式返回success里就没有了
            responseDecoder: undefined, // 解码器
            resultHandler: undefined, // 返回处理函数
        };
        // 下面才是请求参数
        options.url = url;
        options.header = headers;
        options.data = body;
        // 响应值类型
        if (resType === 'json')
            options.dataType = 'json';
        else if (resType === 'blob')
            options.responseType = 'arraybuffer';
        else
            options.responseType = 'text';
        options.success = function (_a) {
            var status = _a.statusCode, data = _a.data, headers = _a.header;
            if (options.enableChunked) {
                resValue.pending.length && _handlePending(resValue);
                if (!resValue.responseBody.length) {
                    ALLOW_PROGRESS.allow = false; // 不允许进度
                    reject({ code: 600098, msg: '用了进度，onChunkReceived没有触发。该bug，需向微信反馈' });
                    return;
                }
                resolve(resValue.resultHandler(resValue.status, resValue.responseBody, new Map(Object.entries(resValue.headers)), resValue.total));
            }
            else
                resolve({ status: status, headers: new Map(Object.entries(headers)), data: data });
        }; // json是否自动反序列化，需验证
        options.fail = function (_a) {
            var code = _a.errno, msg = _a.errMsg;
            return reject({ code: code || -1, msg: msg });
        };
        ALLOW_PROGRESS.allow && onProgress && (options.enableChunked = true); // 要进度就开流式传输
        requestTask = wx.request(options);
        // 手动取消
        cancel && (cancel.abort = function () {
            requestTask.abort();
            cancel.isCancelled = true; // 表示已手动取消
            // 避免abort失效, 直接中断Promise
            reject({ code: 600099, msg: '手动取消' }); // code根据微信的erron规则编的
        });
        // 响应进度
        if (options.enableChunked) {
            var loaded_1 = 0, total_1 = 0; // total只用于判断是否调用onProgress，因响应头可能无Content-Length字段
            // 获取响应头中的总大小
            requestTask.onHeadersReceived(function (_a) {
                var _b;
                var header = _a.header, status = _a.statusCode;
                if (status !== 200) {
                    resolve({ status: status, headers: header, msg: '网络请求失败' });
                    return;
                }
                resValue.status = status;
                resValue.headers = header;
                var isContentType = function (key) { return util_1.contentTypeRegExp.test(key); }; // 判断key是否是contentType的函数
                var isContentLength = function (key) { return util_1.contentLengthRegExp.test(key); }; // 判断key是否是contentLength的函数
                var originKeyMap = (0, not_support_Headers_1.getObjectHeadersKey)(header, [isContentType, isContentLength]); // 获取contentLength、contentType真实名字
                total_1 = resValue.total = (+header[originKeyMap.get(isContentLength)] || resValue.total); // 获取
                var responseType = (0, response_util_1.getResponseType)(resType, header[originKeyMap.get(isContentType)]); // 获取返回值类型
                (_b = (0, response_util_1.createResponseTypeHandle)(responseType), resValue.responseDecoder = _b[0], resValue.resultHandler = _b[1]); // 创建每一部分返回和最终返回处理函数
            });
            // 根据收到的每个人chunk 调响应进度函数
            requestTask.onChunkReceived(function (_a) {
                var data = _a.data;
                if (resValue.responseDecoder)
                    resValue.responseBody.push(resValue.responseDecoder.decode(data)); // blob直接放入数组，否则解码后放入数组
                else
                    resValue.pending.push(data);
                total_1 && onProgress(loaded_1 += data.byteLength, resValue.total);
                resValue.total = resValue.total > loaded_1 ? resValue.total : loaded_1; // 如无contentLength，用blob、arrayBuffer导致无法合并。所以保底设置一个
            });
        }
    }).finally(function () {
        if (requestTask) {
            requestTask.offChunkReceived();
            requestTask.offHeadersReceived();
        }
    });
};
/**
 * @Author: sonion
 * @msg: wx.request 请求基础封装
 * @param { string } url - 请求url
 * @param { RequestOptions } [options] - 请求参数对象，可选
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { RequestOptions['headers'] } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选。默认为0
 * @param { RequestOptions['cancel'] } [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param { RequestOptions['maxRetries'] } [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param { RequestOptions['resType'] } [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param { RequestOptions['onProgress'] } [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return { RequestPromiseReturned } 返回Promise<{status: number, headers: Headers, data: any}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 */
var request = function (url, options) {
    var _a;
    var processedParams;
    (_a = (0, not_support_Headers_1.requestParamsHandle)(url, options), url = _a.url, processedParams = _a.options); // ts 不能直接赋值原 options 变量
    processedParams.url = url; // 合并url到请求参数中，在公共_requestRetry中好处理
    if (ALLOW_PROGRESS.allow && processedParams.maxRetries === 0) {
        processedParams.maxRetries = 1; // 为应对小程序bug，设置一次重试
    }
    else if (!ALLOW_PROGRESS.allow && processedParams.onProgress) {
        delete processedParams.onProgress;
    }
    return (0, retry_util_1._requestRetry)(processedParams, _request); // 正式请求开始
};
exports.request = request;
/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的 wx.request 请求
 * @param { Interceptor } interceptors - 拦截器对象
 * @param { Interceptor['request'] } [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param { Interceptor['response'] } [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param { Interceptor['catch'] } [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param { Interceptor['finally'] } [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return { RequestMainFunc } 返回使用了拦截器的请求函数。参数和requestXhr方法一样。
 */
request.create = function (interceptors) {
    if (interceptors === void 0) { interceptors = {}; }
    return create_1.createInterceptor.call(request, interceptors);
};
