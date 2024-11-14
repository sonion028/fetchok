"use strict";
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
exports.getResponseType = exports.createResponseTypeHandle = void 0;
// 动态决定是否导入自定义TextDecoder
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var MyTextDecoder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(typeof TextDecoder === 'undefined')) return [3 /*break*/, 2];
                return [4 /*yield*/, Promise.resolve().then(function () { return require('./textDecoder'); })];
            case 1:
                MyTextDecoder = (_a.sent()).MyTextDecoder;
                // @ts-ignore
                globalThis.TextDecoder = MyTextDecoder;
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); })();
/**
 * @Author: sonion
 * @msg: 将包含ArrayBuffer的数组合并为一个ArrayBuffer
 * @param {ArrayBuffer[]} res - 包含ArrayBuffer的数组
 * @param {number} total - 多个ArrayBuffer的总长度
 * @return {ArrayBuffer}
 */
var _mergedArrayBuffer = function (res, total) {
    if ((res === null || res === void 0 ? void 0 : res.length) === 1)
        return res[0];
    var mergedBuffer = new Uint8Array(total);
    var offset = 0;
    res.forEach(function (item) {
        mergedBuffer.set(new Uint8Array(item), offset);
        offset += item.byteLength;
    });
    return mergedBuffer.buffer;
};
/**
 * @Author: sonion
 * @msg: 创建'json'、'text'、'blob'三种返回格式的处理函数。第一个是push前的Decoder对象，第二个是最终返回处理函数
 * @param {'json'|'text'|'blob'} responseType
 * @return {[object, function]}
 */
var createResponseTypeHandle = function (responseType) {
    var decoder;
    if (responseType === 'text' || responseType === 'json') {
        decoder = new TextDecoder('utf-8');
    }
    else {
        decoder = { decode: function (param) { return param; } }; // fakeDecoder
    }
    ;
    if (responseType === 'text')
        return [
            decoder,
            function (status, res, headers) { return ({ status: status, data: res.join(''), headers: headers }); }
        ];
    else if (responseType === 'json')
        return [
            decoder,
            function (status, res, headers) { return ({ status: status, data: JSON.parse(res.join('')), headers: headers }); }
        ];
    else if (responseType === 'blob')
        return [
            decoder,
            // blob返回一个数组带上类型  其它不带，多传参数也不影响
            function (status, res, headers, total) {
                var data;
                if (typeof Blob === void 0)
                    data = _mergedArrayBuffer(res, total);
                else
                    data = new Blob(res, { type: headers.get("content-type") });
                return ({ status: status, data: data, headers: headers });
            }
        ];
    else
        return [
            decoder,
            function (status, res, headers, total) { return ({ status: status, data: _mergedArrayBuffer(res, total), headers: headers }); }
        ];
};
exports.createResponseTypeHandle = createResponseTypeHandle;
/**
 * @Author: sonion
 * @msg: 获取返回值类型
 * @param {'text'|'json'|'blob'|'arrayBuffer'} userResType - 用户指定的返回值类型
 * @param {string} resContentType - 响应头的contentType
 * @return {string}
 */
var getResponseType = function (userResType, resContentType) {
    if (resContentType === void 0) { resContentType = ''; }
    if (userResType)
        return userResType;
    else if (resContentType.startsWith("application/json"))
        return 'json';
    else if (resContentType.startsWith("text/"))
        return 'text';
    else
        return 'arrayBuffer';
};
exports.getResponseType = getResponseType;
