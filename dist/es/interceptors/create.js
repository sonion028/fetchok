"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterceptor = void 0;
/**
 * @Author: sonion
 * @msg: 创建拦截器的请求
 * @param { Interceptor } interceptors - 拦截器对象
 * @param { Interceptor['request'] } [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param { Interceptor['response'] } [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param { Interceptor['catch'] } [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param { Interceptor['finally'] } [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return {function} 返回使用了拦截器的请求函数。参数和request、requestXhr方法一样。
 */
var createInterceptor = function (interceptors) {
    var _this = this;
    // 赋值给request.create或requestXhr.create调用this就指向request或requestXhr。bind为了保险：可能用户会赋值给别的函数
    return function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var url, options;
        if (interceptors.request)
            _a = interceptors.request.apply(interceptors, args), url = _a[0], options = _a[1];
        else
            url = args[0], options = args[1];
        if (!args[1].cancel && (options === null || options === void 0 ? void 0 : options.cancel))
            console.warn("在请求拦截器中添加的cancel参数可能外部读取不到，不能手动取消哟");
        if (!url)
            throw {
                code: -1,
                msg: "请求拦截器需要返回一个对象。url属性必填, options属性可选",
            };
        return _this(url, options)
            .then(function (res) {
            if (interceptors.response) {
                var newRes = interceptors.response(res);
                if (newRes === null || newRes === void 0)
                    throw { code: -1, msg: "响应拦截器必须返回不为空的数据" };
                return newRes;
            }
            else
                return res;
        })
            .catch(function (err) {
            interceptors.catch && interceptors.catch(err);
            throw err;
        })
            .finally(function () {
            interceptors.finally && interceptors.finally();
        });
    };
};
exports.createInterceptor = createInterceptor;
