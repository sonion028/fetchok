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
exports.concurrencyRequest = exports._requestRetry = void 0;
/**
 * @Author: sonion
 * @msg: node:http、xhr基础封装，重试部分。在内部调_request
 * @param {string} url 请求地址
 * @param {object} options 请求参数集
 * @return {promise} 返回promise对象
 */
var _requestRetry = function (options, _requestMain) { return __awaiter(void 0, void 0, void 0, function () {
    var retryCount, maxRetries, response, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                retryCount = 0;
                maxRetries = (options === null || options === void 0 ? void 0 : options.maxRetries) || 0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, _requestMain(options)];
            case 2:
                response = _b.sent();
                if ('status' in response && response.status !== 200)
                    throw response;
                return [2 /*return*/, response]; // 只有正常返回才用resolve,所以这里的都是正确的
            case 3:
                err_1 = _b.sent();
                // 因为用的>=所以都是0的时候就结束返回了
                if (retryCount >= maxRetries || ((_a = options === null || options === void 0 ? void 0 : options.cancel) === null || _a === void 0 ? void 0 : _a.isCancelled)) {
                    if (err_1 instanceof Error)
                        throw __assign({ code: -1, msg: err_1.message }, err_1); // 重试后依然失败、手动取消 直接跳出
                    else
                        return [2 /*return*/, err_1]; // 服务端错误，重定向到then
                }
                return [3 /*break*/, 4];
            case 4:
                if (retryCount++ < maxRetries) return [3 /*break*/, 1];
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports._requestRetry = _requestRetry;
var _run = function (requestFunc, tasks, resultList, resolve) {
    var _a = tasks.shift(), url = _a.url, options = _a.options;
    var task = requestFunc(url, options);
    resultList.push(task);
    if (tasks.length <= 0) {
        Promise.allSettled(resultList).then(resolve(resultList));
        return;
    }
    ;
    task.finally(function () { return _run(requestFunc, tasks, resultList, resolve); });
};
/**
 * @Author: sonion
 * @msg: 并发控制函数
 * @param {Requestor} requestFunc - 请求方法
 * @param {Array} tasks - 请求参数对象数组
 * @param {number} maxNum - 最大并发数
 * @return {Promise<unknown>} - 返回请求Promise数组的Promise
 */
var concurrencyRequest = function (requestFunc, tasks, maxNum) {
    if (maxNum === void 0) { maxNum = 5; }
    if (!Array.isArray(tasks))
        throw new Error('任务列表必须是一个数组');
    if (tasks.length === 0)
        return Promise.resolve([]);
    return new Promise(function (resolve) {
        var resultList = []; // 结果数组
        var min = Math.min(maxNum, tasks.length); // 考虑任务数如果本就小于最大任务数
        for (var i = 0; i < min; i++) {
            _run(requestFunc, tasks, resultList, resolve);
        }
    });
};
exports.concurrencyRequest = concurrencyRequest;
