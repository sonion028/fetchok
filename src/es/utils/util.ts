import type { HeadersObject } from '../../types'



// toParams函数类型
export type ToParamsFunc = (param: { [key: string]: any })=>string;

/**
 * @Author: sonion
 * @msg: 对象按key排序，再转为key=value形式,属性值为object的会先转json字符串, 手写版
 * @param {object} param 要转换和排序的对象。
 * @return {string} 转完的参数path
 */
const _toParams: ToParamsFunc = (param: Parameters<ToParamsFunc>[0]): ReturnType<ToParamsFunc>=> {
  // 对象->键值二维数组->根据key排升序,并object2string->每个键值对用=链接->再用&连接 // 循环三次效率不高
  // sort内函数返回值大于0时就交换两个数组的顺序，否则就不交换;
  return Object.entries(param).sort((newItem, oldItem) =>{
    (typeof newItem[1] === 'object') && (newItem[1] = JSON.stringify(newItem[1]));
    (typeof oldItem[1] === 'object') && (oldItem[1] = JSON.stringify(oldItem[1])); // 少一次循环，不加这句会漏转换
    return newItem[0] < oldItem[0] ? -1 : 1;
  }).map(item => item.join('=')).join('&')
};


/**
 * @Author: sonion
 * @msg: 对象按key排序，再转为key=value形式,属性值为object的会先转json字符串 不兼容就调用旧版
 * @param {object} param 要转换和排序的对象
 * @return {string} 转完的参数query string
 */
const toParams: ToParamsFunc = (param: Parameters<ToParamsFunc>[0]): ReturnType<ToParamsFunc> => {
  // 原生URLSearchParams对象版
  if (typeof URLSearchParams !== 'undefined') {
    Object.entries(param).forEach(([key, value])=>typeof value === 'object' && (param[key] = JSON.stringify(value)))
    const params = new URLSearchParams(param);
    params.sort();
    // url解码decodeURIComponent // decodeURI 不处理/#.
    // URLSearchParams.prototype.toString 空格会转为“+”
    // @ts-ignore
    return decodeURIComponent(params.toString().replaceAll('+', ' '));
  } else return _toParams(param); // 保底方案
};



// 判断正则不是是content-type、content-length频繁调用会重复生成正则对象，所以单独出来
const contentTypeRegExp = /^content-?type$/i;
const contentLengthRegExp = /^content-?length$/i;
// 获取Content-Type名，因为可能写的不规范
type GetContentTypeNameFunc = (headers: HeadersObject) => string | void;

/**
 * @Author: sonion
 * @msg: 获取headers对象中的contentType各种写法的名称 暂时没用
 * @param {object} headers
 * @return {string | undefined}
 */
const getContentTypeName: GetContentTypeNameFunc = (headers: HeadersObject):string | void =>Object.keys(headers).filter(keyName=>contentTypeRegExp.test(keyName))[0];


const getType = (()=>{
  const regExp = /^\[[a-z]+ ([A-Za-z]+)\]$/; // 会重复创建正则对象，所以立即执行函数提供闭包的方式
  /**
 * @Author: sonion
 * @msg: 获取元素的数据类型
 * @param {any} anyData - 要获取类型的
 * @return {string} - 基本类型返回小写的类型字符串(同typeof)。数组返回'Array',其他引用类型返回Symbol.toStringTag属性值
 */
  const getType = (anyData: unknown): string =>{
    if (anyData === null) return 'null'
    if (typeof anyData !== 'object') return typeof anyData
    if (Array.isArray(anyData)) return 'Array'
    return Object.prototype.toString.call(anyData).replace(regExp, "$1");
  }
  return getType;
})();





export {
  getType,
  toParams,
  contentTypeRegExp,
  contentLengthRegExp
}