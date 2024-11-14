// 不支持Headers构造函数
import { RequestOptions, HeadersObject } from "../../../types";
import { contentTypeRegExp } from "../util";
import { requestParamsAfterHandle } from "./generic.util";

// 判断是否是要找的key的函数
type ValidateFunction = (key: string) => Boolean;

/**
 * @Author: sonion
 * @msg: 查找对象中的属性名（key）是否符合某个规则
 * @param {Record<string, unknown>} headers - 查找的普通对象 这里是普通对象格式的请求或响应头
 * @param {ValidateFunction[]} funcs - 用于判断key是否符合条件的函数数组
 * @return {Map<ValidateFunction, string>}
 */
const getObjectHeadersKey = (
  headers: Record<string, unknown>,
  funcs: ValidateFunction[]
): Map<ValidateFunction, string> => {
  const keyMap: Map<ValidateFunction, string> = new Map();
  Object.keys(headers).forEach((originKeyName) => {
    funcs.forEach((fn) => fn(originKeyName) && keyMap.set(fn, originKeyName));
  });
  return keyMap;
};

/**
 * @Author: sonion
 * @msg: 判断普通对象中的指定属性是否某个值开头。 如：content-type 是不是，但又忽略其后可能的别的参数 application/json、application/x-www-form-urlencoded
 * @param {HeadersObject} headers - 目标对象
 *  * @param {string} key - 判断的属性名
 * @param {string} val - 要以xxx开头的这个值 也就是属性值
 * @return {boolean}
 */
const _validateObjectValueStartWithMethod = (
  headers: HeadersObject,
  key: string,
  val: string
): boolean => {
  return headers[key] ? (headers[key] as string).startsWith(val) : false;
};

/**
 * @Author: sonion
 * @msg: 请求参数处理，适合不支持Headers的场景。如：微信小程序
 * @param {string} url - 请求url
 * @param {object} options - 请求参数
 * @return {object}
 */
const requestParamsHandle = (url: string, options: RequestOptions) => {
  let _validateContentType;
  if (options?.headers) {
    const isContentType = (key: string) => contentTypeRegExp.test(key); // 判断是否是contentType的函数
    const keyMap = getObjectHeadersKey(options.headers as HeadersObject, [
      isContentType,
    ]);
    const contentTypeKey = keyMap.get(isContentType);
    // 没有就设置默认Content-Type，不需要默认就注释这一句。
    if (options.body instanceof FormData) {
      Reflect.deleteProperty(options.headers, contentTypeKey);
    } else if (!options.headers[contentTypeKey]) {
      // 没有就设置默认Content-Type，不需要默认就注释本分支
      options.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=utf-8";
    }
    _validateContentType = (
      options: RequestOptions,
      contentTypeVal: string
    ): boolean =>
      _validateObjectValueStartWithMethod(
        options,
        contentTypeKey,
        contentTypeVal
      );
  }
  return requestParamsAfterHandle(url, options, _validateContentType);
};

export {
  getObjectHeadersKey, // 获取content-type、content-length
  requestParamsHandle, // 不Headers直接导出成品函数
};
