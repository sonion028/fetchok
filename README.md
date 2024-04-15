## fetchok

#### 免责声明
###### 本库遵循ISC协议。且只是对浏览器或类浏览器原生能力的简单封装。因此因为使用本库所产生的任何损失或用于违规用图所产生的法律风险等，本人概不负责。继续使用表示您知晓并同意该条款。否则请立即删除。


#### 目标
###### 本库是对fetch、XMLHttpRequest、node http.request的简单基础封装。目的是封装一个具备完整功能，在项目即安即用的轻量级请求库。除fetch、XMLHttpRequest外，还支持请求/响应拦截器、jsonp、sse等。2.1.0版开始支持TypeScript。

#### 起因
###### 这个库的初衷是在一个较大的项目中每个同事要去实现一遍接口请求的逻辑，实现都不一样。所以需要统一响应结果、token管理等，统一收拢请求，提高对请求的掌控。随着越来越多项目中使用，发现要换回去成本已经很高了。就坚持更新下来了。慢慢的功能加的越来越多。fetch、xhr、node http、重试、超时、手动取消、返回进度、拦截器、拦截器预设。反正自己用到什么就加什么。后期考虑加请求并发控制。
###### 不过一直尽量坚持使用Fetch API原生规范的 url + options 传参，Promise返回。除非像requestSse这种没办法用Promise返回的。


#### 关于request、requestXhr 参数和返回值：
##### 参数大方向上都保持和 fetch API一致，参数一：url，参数二：options。在options中会有一些自定义值，cancel、maxRetries、onProgress、timeout等。
##### 返回值：
###### 响应完全正确：Promise<{ status: number, headers: Headers, data: any }>  reslove
###### 服务端(Server)错误：Promise<{ status: number, headers: Headers, msg: string }>  reslove
###### 在客户端(Client)错误：Promise<{ code: number, msg: string }>  reject
###### 字段解释：status：响应状态，headers：响应头，data: 服务端响应数据，code：错误代码，msg：错误提示。
###### 可以在错误拦截器(catch)中统一错误格式或处理。
###### 如果后端的返回格式是：{code: number, data: any, msg: string}。那也可以直接使用我们准备好的预设拦截器。详细请看下方关于createInterceptorsPreset、createResponsePreset的介绍。



#### 使用说明

#### 安装: 
```
npm install fetchok --save;
或
yarn add fetchok;
```
#### 引入
```
import { 
  requset, 
  requsetXhr, 
  requestEasy, 
  requestJsonp, 
  createJsonp, 
  requestSse, 
  toParams,
  cookie,
  createTokenManager,
  createInterceptorsPreset,
  createResponsePreset,
  concurrencyRequest
} 'fetchok';
或
const { 
  requset, 
  requsetXhr, 
  requestEasy, 
  requestJsonp, 
  createJsonp, 
  requestSse, 
  toParams,
  cookie,
  createTokenManager,
  createInterceptorsPreset,
  createResponsePreset,
  concurrencyRequest
} = require('fetchok');
```
node.js版：
```
import { 
  requset,
  toParams,
  createResponsePreset,
  concurrencyRequest
} from 'fetchok/node';
或
const { 
  requset,
  toParams,
  createResponsePreset,
  concurrencyRequest
} = require('fetchok/node');
```
wx.request（微信小程序）版：
```
import { 
  requset,
  toParams,
  createResponsePreset,
  promisic,
  concurrencyRequest
} from 'fetchok'; 
或
const { 
  requset,
  toParams,
  createResponsePreset,
  promisic,
  concurrencyRequest
} = require('fetchok');
```
TS类型声明导入
```
// 鼠标hover导入语句 方法（函数）可查看类型名
import type { ParamOptions, requestFunc } from 'fetchok/types';
```
##### 注意
###### node 环境目前只支持：requset、toParams、createResponsePreset。request使用的 Fetch API 只支持到 node18。所以node中暂不支持Fetch API。微信小程序支持的方法：requset、toParams、createResponsePreset、promisic。

##### 关于微信小程序
###### 1、小程序现在支持pages目录为miniprogram子目录的模版，不知道为啥。有明白的兄弟帮忙反馈下。
###### 2、因为本库需要同时支持浏览器、nodejs、微信小程序环境。浏览器通过exports字段下的"."子路径支持。nodejs通过exports字段下的"./node"子路径支持，微信小程序不支持子路径（exports字段），只能通过main和module字段支持。按说主"types"字段应该指定小程序环境的TS类型声明文件。但"."下的TS类型声明文件不能被识别，那也就是说浏览器环境的TS类型声明文件就缺失了，这是我们不能接受的。所以主"types"指定为浏览器的TS类型声明文件。这样也能覆盖小程序的大多出类型。可还是有个别函数没有TS类型。可能需要手动指定，目前只有：promisic函数。有知道怎么解决 exports字段下的"."字段下的"types"不生效的兄弟欢迎反馈。
###### 3、小程序的响应进度依赖requestTask.onChunkReceived，但该功能在某些机型上存在不触发的bug（可以去社区向官方反应）。所以在第一次尝试使用进度功能不触发后，会立即重试一次，并彻底关闭该功能（通过在Storage中存ALLOW_PROGRESS属性的方式实现）。
###### 4、小程序通过requestTask.onChunkReceived流式返回时内容可能不稳定，似乎返回的arrayBuffer合并后大于Content-Length。所以被必暂不建议使用。我当前的所有得真机调试都不能确定问题。也欢迎有能力的小伙伴反馈。


>* 包含的所有方法：看导入部分。
>* 其中 requset, requsetXhr, requestEasy, requestJsonp 传参方式、返回(Promise) 同fetch API格式。

>* request - 基于fetch API的封装。支持：请求方法(method)、请求头(headers)、请求体(body)、超时时间(timeout)、手动取消(cancel)、响应进度回调(onProgress)、请求失败重试次数(maxRetries)。其余参数参考fetch API

>* requestXhr - 基于XMLHttpRequest的封装。接口用法同request。另外多了：上传进度回调(upProgress)。

>* requestEasy - 基于XMLHttpRequest的简单封装。只支持: 请求方法(method)、请求头(headers)、请求体(body)。完全原生，除了封装为fetch API接口外不做任何处理。

>* requestJsonp - jsonp请求的Promise封装，用法基本同request。额外参数：回调函数名(callbackName)、后端获取回调函数名的属性(callbackNameProperty)。 不支持：响应进度回调(onProgress)、请求失败重试次数(maxRetries)。

>* createJsonp - 创建一个不受referrer限制的jsonp请求方法。返回jsonp请求方法。用法同requestJsonp。

>* requestSse - sse的简单封装，返回sse事件对象。用法基本同request。额外参数：事件message的事件处理函数(handle)，不支持：响应进度回调(onProgress)、请求失败重试次数(maxRetries)、请求方法(method)。

>* toParams - 将对象转为'key=value&key1=value1&key2=value2'字符串，并按key的升序排列。request、requestXhr在GET请求中传如body时也用这个函数将数据拼接到url。

>* cookie - 工具对象。该对象提供操作cookie的getItem、setItem、removeItem、clear方法。用法同localStorage。

>* createTokenManager - 创建一个支持缓存的token管理器对象。创建对象时指定储存方式('localStorage'、'sessionStorage'、'cookie')，和鉴权类型。通过给获取器和写入器，你可以像普通对象一样读写token、refreshToken，对象会自动存储和更新token、refreshToken到你指定的储存方式，并在对象中维护有缓存。rawToken、rawRefreshToken读取原始token、refreshToken。

>* createInterceptorsPreset - 拦截器预设。该预设针对后端返回格式为：{code: number, data: any, msg: string} 会将前后端所有报错都统一合并格式。你只需要在Promise对象的catch中统一处理就好（比如弹窗提示）。还会自动将后端返回对象和返回对象的data属性中的token、refreshtoken，以及响应头中的Authorization、refreshtoken自动通过token管理器存入你指定的储存方式中(参数和createTokenManager相同)。该预设在请求阶段会自动将token添加到请求头的Authorization字段中。

>* createResponsePreset - 响应拦截器预设。该预设和createInterceptorsPreset唯一不同的是只有响应阶段的拦截器，只统一返回值，不管理token，并且可以接收一个函数作为参数。该函数将在响应成功阶段被调用，传入响应值，如果该函数有返回将会返回到Promise中美如果没有，则还是返回原始响应值。

>* promisic - 将微信小程序API中不支持Promise的普通回调函数式的API转为支持Promise的API。

>* concurrencyRequest - 控制并发请求数量

##### fetch版
```
await request('https://example.com')
```
##### XMLHttpRequest版
```
await requestXhr('https://example.com')
```

##### 更多功能 请求。
```
const options = {
  method: 'POST', // 请求方法
  body: {……}, // 请求体 可选
  headers: {……}, // 请求头 可选
  timeout: 60000, // 超时时间-毫秒 可选
  maxRetries: 5, // 最大重试次数
  cancel: {……}, // 取消对象。可以用options.cancel.abort();手动取消 可选
  // 返回进度，会在每个阶段调用该函数并传入loaded: 完成字节, total: 总字节。 可选
  onProgress: (loaded, total)=>{……}
};
request('https://example.com', options).then(……).catch(……);
```

##### requestXhr用方法同request，多一个上传进度。
```
// 上传进度，会在每个阶段调用该函数并传入loaded: 完成字节, total: 总字节。 可选
options.upProgress = (loaded, total)=>{……};
await requestXhr('https://example.com', options);
```

##### createTokenManager 用法
```
// 创建一个token管理器。在请求拦截器中可用tokenManager.token给headers中的Authorization赋值
// 在响应拦截器中用tokenManager.token = token 赋值更新，会自动更新缓存和localStorage中的值
const tokenManager = createTokenManager('localStorage', 'Bearer');
```

##### 拦截器用法，这里用request，requestXhr用法一样
```
const http = request.create({
  request: (...args)=>{
    args[1].timeout = 60000; // 60秒超时
    args[1].maxRetries = 5; // 出错重试5次
    args[1].headers.Authorization = tokenManager.token; // 请求带token
    return { url: args.url, options: args.options } // 返回参数
  },
  response: ({ res })=>{
    // 更新token 会自动更新localStorage中的token
    tokenManager.token = res.data.token
    return res
  }
  catch: err=>{
    …… // 可以在这里统一错误的格式等
    throw new Error('也可以在这里抛出一个错误')
  },
  finally: ()=>{
    ……
  }
})
// 当然还可以做一些额外的封装使请求更简单
const postHttp = (path, body)=>{
  return hhtp('https://example.com' + path, { body, method: 'POST', headers { 'Content-Type': 'application/json' } } )
}
```

##### 预设拦截器的使用，这里用requestXhr，request用法一样
```
// 解构出拦截器(interceptors)和tokenManager。在额外需要用token管理器的时候就可以用tokenManager
// token储存位置、类型可以通过传参数指定。默认存"sessionStorage"、类型为'Bearer'。
const { tokenManager, ...interceptors } = createInterceptorsPreset('localStorage', 'Bearer');
const http = requestXhr.create(interceptors); // http就是带有预设拦截器的请求方法啦
```

##### 响应拦截器预设
```
const interceptors = createResponsePreset((res)=>{……}); // 可以传一个函数，会接受到响应值，按该函数返回。当然也可以不传。 
const http = request.create(interceptors);
```

##### 控制并发请求数量
```
// 最大并发请求数为5的请求控制器
concurrencyRequest(request, [{ url: 'https://example.com', options: {……} }], 5)
```

##### toParams对象转key=value形式字符串
```
const str = toParams({……})
```

##### cookie对象用法
```
cookie.setItem('token', 'xxx') // 写入cookie
cookie.getItem('token') // 读取
cookie.removeItem('token') // 移除
cookie.clear() // 清空
```

##### requestJsonp示例 
```
// 创建不受referrer限制的jsonp请求方法
const jsonp = createJsonp();
await jsonp('https://example.com', {body: {……}, callbackNameProperty: 'callback'})
```

##### requestSse示例
```
const options = {
  body: {……}, // 请求体 可选
  headers: {……}, // 请求头 可选
  timeout: 60000, // 超时时间-毫秒 可选
  cancel: {……}, // 取消对象。可以用options.cancel.abort();手动取消 可选
  handle: (data)=>{……}
};
const sse = requestSse('https://example.com', options)
sse.addEventlist('message', data=>{……})
```

##### requestEasy使用方法同request。
```
requestEasy('https://example.com', {method: 'POST', body: {……}, headers: {……} }).then(……).catch(……);
```