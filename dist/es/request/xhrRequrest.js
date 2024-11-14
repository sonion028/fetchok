"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestXhr = exports.requestEasy = void 0;
var support_Headers_1 = require("../utils/param/support.Headers");
var retry_util_1 = require("../utils/retry.util");
var create_1 = require("../interceptors/create");
var response_util_1 = require("../utils/response.util");
(function () {
    // 避免不支持的环境报错
    if (typeof XMLHttpRequest) {
        /**
         * @Author: sonion
         * @msg: 分割XMLHttpRequest请求响应头的正则表达式。每次使用都会创建正则对象，故单独写
         */
        XMLHttpRequest.prototype.splitHeadersRegExp = /[\r\n]+/;
        /**
         * @Author: sonion
         * @msg: 获取xhr请求的所有响应头 - 原型方法
         * @return { Map } 响应头数据
         */
        XMLHttpRequest.prototype.getResponseHeaders = function () {
            var headerStr = this.getAllResponseHeaders();
            var arr = headerStr.trim().split(this.splitHeadersRegExp);
            return new Headers(arr.map(function (line) { return line.split(": "); }));
        };
    }
})();
/**
 * @Author: sonion
 * @msg: 最简单的原始xhr封装，不帮忙完成任何调整。
 * @param {string} url 请求地址
 * @param {object} options - 请求参数对象
 * @param {object} [options.headers] - 请求头
 * @param {string} [options.method] - 请求方法
 * @param {object} [options.body] - 请求体数据
 * @return {Promise} 返回结果没有任何封装Promise<xhr.response>
 */
var requestEasy = function (url, _a) {
    var _b = _a === void 0 ? { method: "GET" } : _a, _c = _b.method, method = _c === void 0 ? "GET" : _c, headers = _b.headers, body = _b.body;
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (headers) {
            // 存在请求头就循环设置
            for (var _i = 0, _a = Object.entries(headers); _i < _a.length; _i++) {
                var _b = _a[_i], k = _b[0], v = _b[1];
                xhr.setRequestHeader(k, v);
            }
        }
        xhr.onreadystatechange = function (e) {
            // 请求状态变化
            try {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.response); // 成功
                    }
                    else {
                        resolve({ status: xhr.status, msg: xhr.statusText }); // 直接返回错误代码的
                    }
                }
            }
            catch (err) {
                reject(err);
            }
        };
        xhr.onerror = function (e) {
            reject({ code: -1, msg: xhr.statusText }); // 和不等于200一样的作用
        };
        xhr.send(body);
    });
};
exports.requestEasy = requestEasy;
/**
 * @Author: sonion
 * @msg: xhr主要请求部分封装
 * @param { RequestOptions } options - 请求参数对象
 * @param {string} options.url - 请求地址
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { RequestOptions['headers'] } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选。默认为0(xhr不限制)
 * @param { RequestOptions['cancel'] } [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param { RequestOptions['resType'] } [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param { RequestOptions['onProgress'] } [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @param { RequestOptionsPlus['upProgress'] } [options.upProgress] - 上传进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return { RequestPromiseReturned } 返回Promise<{status: number, headers: Headers, data: any}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 */
var _request = function (_a) {
    var url = _a.url, headers = _a.headers, method = _a.method, body = _a.body, timeout = _a.timeout, cancel = _a.cancel, upProgress = _a.upProgress, onProgress = _a.onProgress, resType = _a.resType, credentials = _a.credentials;
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest(); // 请求对象
        xhr.open(method, url, true); // 最后一个参数是否异步
        if (headers) {
            for (var _i = 0, _a = Object.entries(headers); _i < _a.length; _i++) {
                var _b = _a[_i], k = _b[0], v = _b[1];
                xhr.setRequestHeader(k, v);
            }
        }
        resType === "blob" && (xhr.responseType = "blob");
        typeof resType === "string" &&
            resType.toLowerCase() === "arraybuffer" &&
            (xhr.responseType = "arraybuffer");
        xhr.timeout = timeout;
        if (credentials === "include")
            xhr.withCredentials = true; // 跨域发送cookie
        xhr.onload = function (e) {
            // 成功回调
            var headers = xhr.getResponseHeaders(); // 自定义原型方法
            if (xhr.status < 200 || xhr.status >= 300) {
                resolve({
                    status: xhr.status,
                    headers: headers,
                    msg: xhr.statusText || "网络请求错误",
                }); // 直接返回错误代码的
                // 不存要重试；1xx：临时，换协议等。3xx重定向。4xx：请求错误。5xx：服务器内部错误
            } // 错误前置处理
            var contentType = xhr.getResponseHeader("content-type") || "";
            resType = (0, response_util_1.getResponseType)(resType, contentType);
            var data;
            if (resType === "json")
                data = JSON.parse(xhr.response);
            else if (resType === "text")
                data = xhr.responseText;
            else
                data = xhr.response;
            resolve({ status: xhr.status, headers: headers, data: data });
        };
        xhr.onabort = function (e) {
            // 取消回调
            reject({ code: -1, msg: xhr.statusText || "请求取消" }); // 自定义错误类型, 超时或取消为:-1
        };
        xhr.ontimeout = function (e) {
            // 超时回调
            reject({ code: -1, msg: xhr.statusText || "响应超时" }); // 自定义错误类型, 超时或取消为:-1
        };
        xhr.onerror = function (e) {
            // 错误回调
            reject({ code: -1, msg: xhr.statusText || "未知错误" }); // 自定义错误类型，未知类型:-1
        };
        // xhr.onloadend // 当请求结束时触发，无论请求成功 (load) 还是失败 (abort 或 error)。
        //增加取消请求函数
        cancel &&
            (cancel.abort = function () {
                xhr.abort();
                cancel.isCancelled = true; // 表示已取消
            });
        // 响应进度
        onProgress &&
            (xhr.onprogress = function (e) {
                onProgress(e.loaded, e.total);
            });
        // 请求进度
        upProgress &&
            (xhr.upload.onprogress = function (e) {
                upProgress(e.loaded, e.total);
            });
        xhr.send(body); //post才有用，get没用
    });
}; // 请求部分
/**
 * @Author: sonion
 * @msg: xhr请求基础封装
 * @param { string } url - 请求url
 * @param { RequestOptions } [options] - 请求参数对象，可选
 * @param { RequestOptions['method'] } [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param { RequestOptions['headers'] } [options.headers={}] - 请求头，可选，默认为空对象
 * @param { RequestOptions['body'] } [options.body] - 请求体，可选
 * @param { RequestOptions['timeout'] } [options.timeout=0] - 超时时间(毫秒)，可选。默认为0(xhr不限制)
 * @param { RequestOptions['cancel'] } [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param { RequestOptions['maxRetries'] } [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param { RequestOptions['resType'] } [options.resType] - 手动设置返回类型，可选 blob、arrayBuffer可手动指定。
 * @param { RequestOptions['onProgress'] } [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @param { RequestOptionsPlus['upProgress'] } [options.upProgress] - 上传进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return { RequestPromiseReturned } 返回Promise<{status: number, headers: Headers, data: any}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在该属性。
 */
var requestXhr = function (url, options) {
    var _a;
    var processedParams;
    (_a = (0, support_Headers_1.requestParamsHandle)(url, options), url = _a.url, processedParams = _a.options); // ts 不能直接赋值原 options 变量
    processedParams.url = url; // 合并url到请求参数中，在公共_requestRetry中好处理
    return (0, retry_util_1._requestRetry)(processedParams, _request); // 正式请求开始
};
exports.requestXhr = requestXhr;
/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的xhr请求
 * @param { Interceptor } interceptors - 拦截器对象
 * @param { Interceptor['request'] } [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param { Interceptor['response'] } [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param { Interceptor['catch'] } [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param { Interceptor['finally'] } [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return { RequestMainFunc } 返回使用了拦截器的请求函数。参数和requestXhr方法一样。
 */
requestXhr.create = function (interceptors) {
    if (interceptors === void 0) { interceptors = {}; }
    return create_1.createInterceptor.call(requestXhr, interceptors);
};
