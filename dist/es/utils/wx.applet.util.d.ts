export type PromiseicType = (func: Function) => (args: {
    [key: string]: any;
}) => Promise<unknown>;
/**
 * @Author: sonion
 * @msg: 将微信小程序API中不支持Promise的简单转换为支持Promise的方式
 * @param {Function} func - 微信小程序API
 * @return {Function} 返回用Promise封装后的微信API
 */
declare const promisic: PromiseicType;
export { promisic };
