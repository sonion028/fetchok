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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
// 请求参数处理
var support_Headers_1 = require("../utils/param/support.Headers");
// 创建各类型响应处理函数
var response_util_1 = require("../utils/response.util");
// 创建拦截器函数
var create_1 = require("../interceptors/create");
var RequestPromiseReturned2 = Promise;
// =====
/**
 * @Author: sonion
 * @msg: fetch请求封装 - 除列以下参数外，其余未列出参数都按fetch参数
 * @param { string } url - 请求地址
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
var request = function (url, options) { return __awaiter(void 0, void 0, RequestPromiseReturned2, function () {
    var processedOptions, controller_1, retryCount, maxRetries, response, total, contentType, responseType, data, loaded, responseBody, _a, responseDecoder, resultHandler, reader, _b, done, value, err_1;
    var _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (options) {
                    (_c = (0, support_Headers_1.requestParamsHandle)(url, options), url = _c.url, processedOptions = _c.options); // 参数处理 options是对象所以可以不用返回
                    if (options.cancel || options.timeout) {
                        controller_1 = new AbortController();
                        options.signal = controller_1.signal; // 设置信号
                        options.cancel = options.cancel || {}; // 设置超时要借用取消，可能没有传cancel参数，就指定默认。就算没传超时还是可能用到
                        options.cancel.abort = function () { return controller_1.abort(); };
                    } // 超时或者取消
                    options.timeout && setTimeout(options.cancel.abort, options.timeout); // options.timeout存在就启动 超时取消
                }
                retryCount = 0;
                maxRetries = (processedOptions === null || processedOptions === void 0 ? void 0 : processedOptions.maxRetries) || 0;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 8, , 9]);
                return [4 /*yield*/, fetch(url, processedOptions)];
            case 2:
                response = _e.sent();
                if (!response.ok) {
                    // const err: CustomError = new Error(response.statusText || '网络请求错误'); // 重试根据这个判断
                    // err.status = response.status; // 将状态加到报错信息里
                    // throw err;
                    throw {
                        status: response.status,
                        headers: response.headers,
                        msg: response.statusText || "网络请求错误",
                    };
                }
                total = +response.headers.get("content-length");
                contentType = response.headers.get("content-type") || "";
                responseType = (0, response_util_1.getResponseType)(options === null || options === void 0 ? void 0 : options.resType, contentType);
                if (!(!(options === null || options === void 0 ? void 0 : options.onProgress) || !total)) return [3 /*break*/, 4];
                return [4 /*yield*/, response[responseType]()];
            case 3:
                data = _e.sent();
                return [2 /*return*/, { status: response.status, headers: response.headers, data: data }]; // 不带进度的返回
            case 4:
                loaded = 0, responseBody = [];
                _a = (0, response_util_1.createResponseTypeHandle)(responseType), responseDecoder = _a[0], resultHandler = _a[1];
                reader = response.body.getReader();
                _e.label = 5;
            case 5:
                if (!true) return [3 /*break*/, 7];
                return [4 /*yield*/, reader.read()];
            case 6:
                _b = _e.sent(), done = _b.done, value = _b.value;
                if (done)
                    return [2 /*return*/, resultHandler(response.status, responseBody, response.headers, total)]; // 这里处理的返回值。blob用其构造函数处理、否者拼接
                if ((_d = options.signal) === null || _d === void 0 ? void 0 : _d.aborted)
                    throw new DOMException("request canceled", "AbortError"); // 这个支持错误名，fetch原生取消，错误对象name就是AbortError。
                loaded += value.length; // 这里value可能为空，可以加判断或try…catch。暂不加，先测试一段时间。
                responseBody.push(responseDecoder.decode(value)); // blob直接放入数组，否则解码后放入数组
                options.onProgress(loaded, total);
                return [3 /*break*/, 5];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_1 = _e.sent();
                // 因为用的>=所以都是0的时候就结束返回了
                if (retryCount >= maxRetries || "AbortError" === err_1.name) {
                    // 超次数或手动取消
                    // err.status = err.status || -1; // 加一个默认状态
                    if (err_1 instanceof Error) {
                        throw __assign({ code: -1, msg: err_1.message }, err_1); // 前端错误，直接抛出
                    }
                    else
                        return [2 /*return*/, err_1]; // 服务端错误，重定向到then
                }
                return [3 /*break*/, 9];
            case 9:
                if (retryCount++ < maxRetries) return [3 /*break*/, 1];
                _e.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.request = request;
/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的xhr请求
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
