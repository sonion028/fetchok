import { toParams } from './es/utils/util'
import { request } from './es/request/wxRequest'
import { createResponsePreset } from './es/interceptors/presetResponse';
import { promisic } from './es/utils/wx.applet.util';
import { concurrencyRequest } from './es/utils/retry.util'


export {
  toParams,
  request,
  createResponsePreset,
  promisic,
  concurrencyRequest // 并发控制工具函数
}