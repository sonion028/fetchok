import type { CreateInterceptorFunc } from '../../types';
/**
 * @Author: sonion
 * @msg: 创建拦截器的请求
 * @param {object} interceptors - 拦截器对象
 * @param {function} [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param {function} [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param {function} [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param {function} [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return {function} 返回使用了拦截器的请求函数。参数和request、requestXhr方法一样。
 */
declare const createInterceptor: CreateInterceptorFunc;
export { createInterceptor };
