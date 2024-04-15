import { toParams } from "./es/utils/util"
import { cookie, createTokenManager } from "./es/utils/authManger"
import { request } from './es/request/fetchRequest';
import { requestEasy, requestXhr } from './es/request/xhrRequrest';
import { createJsonp, requestJsonp } from './es/request/jsonpRequest';
import { requestSse } from './es/request/sseRequest';
import { createInterceptorsPreset } from './es/interceptors/preset';
import { createResponsePreset } from './es/interceptors/responsePreset'
import { createFormData } from './es/utils/param/support.Headers';
import { concurrencyRequest } from './es/utils/retry.util'


export {
  toParams,
  createFormData, // 创建数据
  request,
  cookie, // cookie操作对象
  createTokenManager, // token管理器
  createInterceptorsPreset, // 拦截器预设
  createResponsePreset, // 响应拦截器预设
  requestXhr, // xhr版本
  requestEasy, // 简单的xhr请求
  requestJsonp, // 简单jsonp
  createJsonp, // 不受referrer影响的jsp
  requestSse, // sse后端可多次推送的请求。server sent events
  concurrencyRequest // 并发控制工具函数
};