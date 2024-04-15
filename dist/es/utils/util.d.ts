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
/**
 * @Author: sonion
 * @msg: 获取元素的数据类型
 * @param {any} anyData - 要获取类型的
 * @return {string} - 基本类型返回小写的类型字符串(同typeof)。数组返回'Array',其他引用类型返回Symbol.toStringTag属性值
 */
declare const getType: {
    (anyData: unknown): string;
    regExp: RegExp;
};
export { getType, toParams, contentTypeRegExp, contentLengthRegExp };
