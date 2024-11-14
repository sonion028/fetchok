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
exports.request = void 0;
var http_1 = require("http");
var https_1 = require("https");
var create_1 = require("../interceptors/create");
// 请求参数处理
var support_Headers_1 = require("../utils/param/support.Headers");
// 创建各类型响应处理函数
var response_util_1 = require("../utils/response.util");
var retry_util_1 = require("../utils/retry.util");
/**
 * @Author: sonion
 * @msg: node:http主要请求部分封装
 * @param {object} options - 请求参数对象
 * @param {string} options.hostname - 请求域名
 * @param {string} options.port - 请求端口
 * @param {string} options.path - 请求路径
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { RequestOptions['headers'] } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选
 * @param { RequestOptions['cancel'] } [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param { RequestOptions['maxRetries'] } [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param { RequestOptions['resType'] } [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param { RequestOptions['onProgress'] } [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return { RequestPromiseReturned } 返回Promise<{status: number, headers: Headers, data: any}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 */
var _request = function (_a) {
    var body = _a.body, timeout = _a.timeout, cancel = _a.cancel, upProgress = _a.upProgress, onProgress = _a.onProgress, resType = _a.resType, options = __rest(_a, ["body", "timeout", "cancel", "upProgress", "onProgress", "resType"]);
    return new Promise(function (resolve, reject) {
        var _http = options.port === 443 ? https_1.request : http_1.request; // 需要判断是http还是https
        var req = _http(options, function (res) {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                // const err: CustomError = new Error(res.statusMessage);
                // err.status = res.statusCode;
                // reject(err); // 直接返回错误代码的
                resolve({
                    status: res.statusCode,
                    headers: new Headers(res.headers),
                    msg: res.statusMessage,
                });
                return;
            }
            var contentType = res.headers["content-type"] || "";
            var responseType = (0, response_util_1.getResponseType)(resType, contentType);
            var _a = (0, response_util_1.createResponseTypeHandle)(responseType), responseDecoder = _a[0], resultHandler = _a[1]; // 创建每一部分返回和最终返回处理函数
            var total = +parseInt(res.headers["content-length"]) || 0;
            var loaded = 0, responseBody = [];
            res.on("data", function (chunk) {
                responseBody.push(responseDecoder.decode(chunk)); // blob直接放入数组，否则解码后放入数组
                total && onProgress && onProgress((loaded += chunk.length), total);
            });
            res.on("end", function () {
                // 这里处理的返回值。blob用其构造函数处理、否者拼接
                resolve(resultHandler(res.statusCode, responseBody, new Headers(res.headers), total));
            });
        });
        // 超时
        timeout &&
            req.setTimeout(timeout, function () {
                req.destroy();
            });
        //增加取消请求函数
        cancel &&
            (cancel.abort = function () {
                req.destroy();
                cancel.isCancelled = true; // 表示已手动取消
            });
        // 错误
        req.on("error", function (err) {
            // err.status = -1 // 前端未知错误
            reject(__assign({ code: -1, msg: err.message }, err)); // 直接返回错误代码的
        });
        //发送请求体
        body && req.write(body); // 上传进度，可以分成多次发送来实现
        req.end();
    });
};
/**
 * @Author: sonion
 * @msg: nodejs http请求封装
 * @param { string } url - 请求url
 * @param { RequestOptions } [options] - 请求参数对象，可选
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { RequestOptions['headers'] } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选
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
    var res;
    if (options)
        (_a = (0, support_Headers_1.requestParamsHandle)(url, options), url = _a.url, res = _a.options); // 参数处理 options是对象所以可以不用返回
    var urlObj = new URL(url);
    var paramString = urlObj.searchParams.toString();
    var processedParams = __assign(__assign({}, res), { port: urlObj.protocol === "https:" ? 443 : Number(urlObj.port) || 80, hostname: urlObj.hostname, path: paramString ? urlObj.pathname + "?" + paramString : urlObj.pathname });
    return (0, retry_util_1._requestRetry)(processedParams, _request); // 正式请求开始
};
exports.request = request;
/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的http请求
 * @param { Interceptor } interceptors - 拦截器对象
 * @param { Interceptor['request'] } [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param { Interceptor['response'] } [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param { Interceptor['catch'] } [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param { Interceptor['finally'] } [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return { RequestMainFunc } 返回使用了拦截器的请求函数。参数和request方法一样。
 */
request.create = function (interceptors) {
    if (interceptors === void 0) { interceptors = {}; }
    return create_1.createInterceptor.call(request, interceptors);
};
