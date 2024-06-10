export type ToParamsFunc = (param: {
    [key: string]: any;
}) => string;
/**
 * @Author: sonion
 * @msg: 对象按key排序，再转为key=value形式,属性值为object的会先转json字符串 不兼容就调用旧版
 * @param {object} param 要转换和排序的对象
 * @return {string} 转完的参数query string
 */
declare const toParams: ToParamsFunc;
declare const contentTypeRegExp: RegExp;
declare const contentLengthRegExp: RegExp;
declare const getType: (anyData: unknown) => string;
export { getType, toParams, contentTypeRegExp, contentLengthRegExp };
