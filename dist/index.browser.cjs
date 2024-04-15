(()=>{"use strict";var e={116:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createInterceptor=void 0;t.createInterceptor=function(e){var t=this;return function(){for(var r,n,o,a=[],s=0;s<arguments.length;s++)a[s]=arguments[s];if(e.request?(n=(r=e.request.apply(e,a))[0],o=r[1]):(n=a[0],o=a[1]),!n)throw{code:-1,msg:"请求拦截器需要返回一个对象。url属性必填, options属性可选"};return t(n,o).then((function(t){if(e.response){var r=e.response(t);if(null==r)throw{code:-1,msg:"响应拦截器必须返回不为空的数据"};return r}return t})).catch((function(t){throw e.catch&&e.catch(t),t})).finally((function(){e.finally&&e.finally()}))}}},199:function(e,t,r){var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)},o=this&&this.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};Object.defineProperty(t,"__esModule",{value:!0}),t.createInterceptorsPreset=void 0;var a=r(343),s=r(164);t.createInterceptorsPreset=function(e,t){void 0===e&&(e="sessionStorage"),void 0===t&&(t="Bearer");var r=(0,a.createTokenManager)(e,t);return n(n({request:function(e,t){return t.headers instanceof Headers?t.headers.set("Authorization",r.token||""):(t.headers=t.headers||{},t.headers.Authorization=r.token),[e,t]}},(0,s.createResponsePreset)((function(e){e.status;var t,n,a,s,i,c,u,l,f=e.headers,d=o(e,["status","headers"]);u=f.get("Authorization"),l=f.get("refreshtoken"),"data"in d&&((u=u||(null===(t=d.data)||void 0===t?void 0:t.token)||(null===(a=null===(n=d.data)||void 0===n?void 0:n.data)||void 0===a?void 0:a.token))&&(r.token=u),(l=l||(null===(s=d.data)||void 0===s?void 0:s.refreshtoken)||(null===(c=null===(i=d.data)||void 0===i?void 0:i.data)||void 0===c?void 0:c.refreshtoken))&&(r.refreshToken=l))}))),{tokenManager:r})}},164:function(e,t,r){var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)},o=this&&this.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};Object.defineProperty(t,"__esModule",{value:!0}),t.createResponsePreset=void 0;var a=r(547);
/**
 * @Author: sonion
 * @msg: 创建响应拦截器预设
 * @param {function} [callback] - 可以传一个函数，会传入响应值。会返回该函数返回值，如没有则返回服务端响应值
 * @return {any}
 */t.createResponsePreset=function(e){return{response:function(t){var r,s,i,c=t.status,u=t.headers,l=o(t,["status","headers"]),f=e&&e(n({status:c,headers:u},l));if(200!==c)throw{code:-1,msg:(null==l?void 0:l.msg)||(null===(r=null==l?void 0:l.data)||void 0===r?void 0:r.msg)||"网络请求错误"};if("data"in l&&"Object"===(0,a.getType)(l.data)&&((null===(s=l.data)||void 0===s?void 0:s.code)||!(null===(i=l.data)||void 0===i?void 0:i.data)))throw l.data;return f||l.data},catch:function(e){throw n({code:-1,msg:e.message},e)}}}},746:function(e,t,r){var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)},o=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,a){function s(e){try{c(n.next(e))}catch(e){a(e)}}function i(e){try{c(n.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,i)}c((n=n.apply(e,t||[])).next())}))},a=this&&this.__generator||function(e,t){var r,n,o,a,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(i){return function(c){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;a&&(a=0,i[0]&&(s=0)),s;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,n=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=t.call(e,s)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.request=void 0;var s=r(562),i=r(256),c=r(116),u=function(e,t){return o(void 0,void 0,void 0,(function(){var r,o,c,u,l,f,d,p,h,y,v,b,g,m,w,P,_,O,T,j,k;return a(this,(function(a){switch(a.label){case 0:t&&(j=(0,s.requestParamsHandle)(e,t),e=j.url,r=j.options,(t.cancel||t.timeout)&&(o=new AbortController,t.signal=o.signal,t.cancel=t.cancel||{},t.cancel.abort=function(){return o.abort()}),t.timeout&&setTimeout(t.cancel.abort,t.timeout)),c=0,u=(null==r?void 0:r.maxRetries)||0,a.label=1;case 1:return a.trys.push([1,8,,9]),[4,fetch(e,r)];case 2:if(!(l=a.sent()).ok)throw{status:l.status,headers:l.headers,msg:l.statusText||"网络请求错误"};return f=+l.headers.get("content-length"),d=l.headers.get("content-type")||"",p=(0,i.getResponseType)(null==t?void 0:t.resType,d),(null==t?void 0:t.onProgress)&&f?[3,4]:[4,l[p]()];case 3:return h=a.sent(),[2,{status:l.status,headers:l.headers,data:h}];case 4:y=0,v=[],b=(0,i.createResponseTypeHandle)(p),g=b[0],m=b[1],w=l.body.getReader(),a.label=5;case 5:return[4,w.read()];case 6:if(P=a.sent(),_=P.done,O=P.value,_)return[2,m(l.status,v,l.headers,f)];if(null===(k=t.signal)||void 0===k?void 0:k.aborted)throw new DOMException("request canceled","AbortError");return y+=O.length,v.push(g.decode(O)),t.onProgress(y,f),[3,5];case 7:return[3,9];case 8:if(T=a.sent(),c>=u||"AbortError"===T.name){if(T instanceof Error)throw n({code:-1,msg:T.message},T);return[2,T]}return[3,9];case 9:if(c++<u)return[3,1];a.label=10;case 10:return[2]}}))}))};t.request=u,
/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的xhr请求
 * @param {object} interceptors - 拦截器对象
 * @param {function} [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param {function} [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param {function} [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param {function} [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return {function} 返回使用了拦截器的请求函数。参数和request方法一样。
 */
u.create=function(e){return void 0===e&&(e={}),c.createInterceptor.call(u,e)}},524:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createJsonp=t.requestJsonp=void 0;var n=r(547),o=function(e,t){void 0===t&&(t={callbackNameProperty:"callback"}),t.callbackName=t.callbackName||"__"+(1e11*Math.random()+1e11).toString(32).replaceAll(".","_");var r=document.createElement("script");return r.type="text/javascript",(t.cancel||t.timeout)&&(t.cancel=t.cancel||{},t.cancel.abort=function(){delete window[t.callbackName],r.remove(),r=null}),t.timeout&&setTimeout(t.cancel.abort,t.timeout),new Promise((function(o,a){try{window[t.callbackName]=o,r.src="".concat(e,"?").concat(t.callbackNameProperty||"callback","=").concat(t.callbackName),t.body&&(r.src,(0,n.toParams)(t.body)),document.head.appendChild(r)}catch(e){a(e)}})).finally((function(){delete window[t.callbackName],r.remove(),r=null}))};
/**
 * @Author: sonion
 * @msg: Promise风格的jsonp版本的网络请求
 * @param {string} url 请求地址
 * @param {object} [options.body] - 请求参数，可选
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选
 * @param {string} [options.callbackNameProperty='callback'] - 后端获取回调函数名的属性。默认callback 可选
 * @param {string} [options.callbackName] - 回调函数名-可选。不指定就自动生成
 * @return {Promise<unknown>} Promise<unknown>响应数据，未做封装
 */t.requestJsonp=o;t.createJsonp=function(){var e=document.createElement("meta");return e.name="referrer",e.content="no-referrer",document.head.appendChild(e),o}},505:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.requestSse=void 0;var n=r(547);
/**
 * @Author: sonion
 * @msg: sse请求。该请求基于事件，参数和request参数一样。返回一个事件对象，通过addEventListener注册事件处理函数接收返回值
 * @param {string} url 请求地址
 * @param {object} [options.body] - 请求参数，可选
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选
 * @param {function} [options.handle] - 事件message的处理函数，可选。也可以用返回值注册事件。
 * @return {EventSource}  EventSource对象，addEventListener注册message事件
 */t.requestSse=function(e,t){void 0===t&&(t={}),t.credentials&&"include"===t.credentials&&(t.withCredentials=!0),t.body&&(e+="?"+(0,n.toParams)(t.body));var r=new EventSource(e,t);return t.handler&&r.addEventListener("message",t.handler),(t.cancel||t.timeout)&&(t.cancel=t.cancel||{},t.cancel.abort=function(){return r.close()}),t.timeout&&setTimeout(t.cancel.abort,t.timeout),r}},232:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.requestXhr=t.requestEasy=void 0;var n=r(562),o=r(59),a=r(116),s=r(256);
/**
         * @Author: sonion
         * @msg: 分割XMLHttpRequest请求响应头的正则表达式。每次使用都会创建正则对象，故单独写
         */
XMLHttpRequest.prototype.splitHeadersRegExp=/[\r\n]+/,
/**
         * @Author: sonion
         * @msg: 获取xhr请求的所有响应头 - 原型方法
         * @return { Map } 响应头数据
         */
XMLHttpRequest.prototype.getResponseHeaders=function(){var e=this.getAllResponseHeaders().trim().split(this.splitHeadersRegExp);return new Headers(e.map((function(e){return e.split(": ")})))};t.requestEasy=function(e,t){var r=void 0===t?{method:"GET"}:t,n=r.method,o=void 0===n?"GET":n,a=r.headers,s=r.body;return new Promise((function(t,r){var n=new XMLHttpRequest;if(n.open(o,e,!0),a)for(var i=0,c=Object.entries(a);i<c.length;i++){var u=c[i],l=u[0],f=u[1];n.setRequestHeader(l,f)}n.onreadystatechange=function(e){try{4===n.readyState&&(200===n.status?t(n.response):t({status:n.status,msg:n.statusText}))}catch(e){r(e)}},n.onerror=function(e){r({code:-1,msg:n.statusText})},n.send(s)}))};
/**
 * @Author: sonion
 * @msg: xhr主要请求部分封装
 * @param {object} options - 请求参数对象
 * @param {string} options.url - 请求地址
 * @param {string} [options.method] - 请求的方法，默认为'GET'
 * @param {object} [options.headers] - 请求头，默认为空对象
 * @param {object} [options.body] - 请求体
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，默认为0(xhr不限制)
 * @param {object} [options.cancel] - 取消对象(外部传入，写入取消方法)
 * @param {'text'|'json'|'blob'|'arrayBuffer'} [options.resType] - 手动设置返回类型
 * @param {function} [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)
 * @param {function} [options.upProgress] - 上传进度回调(参数1:已返回字节, 参数2:总字节)
 * @return {Promise} 返回promise对象
 */
var i=function(e){var t=e.url,r=e.headers,n=e.method,o=e.body,a=e.timeout,i=e.cancel,c=e.upProgress,u=e.onProgress,l=e.resType,f=e.credentials;return new Promise((function(e,d){var p=new XMLHttpRequest;if(p.open(n,t,!0),r)for(var h=0,y=Object.entries(r);h<y.length;h++){var v=y[h],b=v[0],g=v[1];p.setRequestHeader(b,g)}"blob"===l&&(p.responseType="blob"),"string"==typeof l&&"arraybuffer"===l.toLowerCase()&&(p.responseType="arraybuffer"),p.timeout=a,"include"===f&&(p.withCredentials=!0),p.onload=function(t){var r=p.getResponseHeaders();200!==p.status&&e({status:p.status,headers:r,msg:p.statusText||"网络请求错误"});var n,o=p.getResponseHeader("content-type")||"";n="json"===(l=(0,s.getResponseType)(l,o))?JSON.parse(p.response):"text"===l?p.responseText:p.response,e({status:p.status,headers:r,data:n})},p.onabort=function(e){d({code:-1,msg:p.statusText||"请求取消"})},p.ontimeout=function(e){d({code:-1,msg:p.statusText||"响应超时"})},p.onerror=function(e){d({code:-1,msg:p.statusText||"未知错误"})},i&&(i.abort=function(){p.abort(),i.isCancelled=!0}),u&&(p.onprogress=function(e){u(e.loaded,e.total)}),c&&(p.upload.onprogress=function(e){c(e.loaded,e.total)}),p.send(o)}))},c=function(e,t){var r,a;return e=(r=(0,n.requestParamsHandle)(e,t)).url,(a=r.options).url=e,(0,o._requestRetry)(a,i)};
/**
 * @Author: sonion
 * @msg: xhr请求基础封装
 * @param {string} url - 请求地址
 * @param {object} [options] - 请求的选项参数，可选
 * @param {string} [options.method='GET'] - 请求的方法，可选，默认为'GET'
 * @param {object} [options.headers={}] - 请求头，可选，默认为空对象
 * @param {object} [options.body] - 请求体，可选
 * @param {number} [options.timeout=0] - 超时时间(毫秒)，可选，默认为0(xhr不限制)
 * @param {object} [options.cancel] - 取消对象(外部传入，用于添加取消请求的方法：abort)，可选
 * @param {number} [options.maxRetries=0] - 最大重试次数，可选，默认0(不重试)
 * @param {'text'|'json'|'blob'|'arrayBuffer'} [options.resType] - 手动设置返回类型，可选。blob必须手动指定
 * @param {function} [options.onProgress] - 返回进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @param {function} [options.upProgress] - 上传进度回调(参数1:已返回字节, 参数2:总字节)，可选
 * @return {Promise} 返回Promise<{status: number, data: Blob, msg: string, headers: Headers}>。
 * @property status - 响应状态。没有错误是200。
 * @property headers - 服务器响应头
 * @property [data] - 服务器响应数据。有错误的时候不存在改属性。
 * @property [msg] - 提示信息。没有出错一般没有改属性
 */t.requestXhr=c,
/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的xhr请求
 * @param {object} interceptors - 拦截器对象
 * @param {function} [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param {function} [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param {function} [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param {function} [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return {function} 返回使用了拦截器的请求函数。参数和requestXhr方法一样。
 */
c.create=function(e){return void 0===e&&(e={}),a.createInterceptor.call(c,e)}},343:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createTokenManager=t.cookie=void 0;
/**
 * @Author: sonion
 * @msg: cookie操作对象
 * @return {{
 *  getItem: (key: string)=>string,
 *  setItem: (key: string, value: string, expires?: Date)=>Boolean,
 *  removeItem: (key: string)=>string,
 *  clear: ()=>undefined
 * }}
 * @property {Function} getItem - 获取key对应的cookie
 * @property {Function} setItem - 写入cookie
 * @property {Function} removeItem - 移除cookie
 * @property {Function} clear - 清空cookie
 */
var r={
/**
     * @Author: sonion
     * @msg: 读取cookie
     * @param {string} key cookie的key
     * @return {string|null} - 返回对应的值，没有就返回null
     */
getItem:function(e){for(var t=0,r=document.cookie.split("; ");t<r.length;t++){var n=r[t].split("=");if(n[0]===e)return decodeURIComponent(n[1])}return null},
/**
     * @Author: sonion
     * @msg: 写入cookie
     * @param {string} key cookie的key
     * @param {string} value cookie值
     * @param {date} [expires] 过期时间 - 不传会话结束就删除
     * @return {boolean} - 是否写入完成，true表示写入过程没有
     */
setItem:function(e,t,r){try{var n="".concat(e,"=").concat(encodeURIComponent(t));return r&&(n+="; expires=".concat(r.toUTCString())),document.cookie=n,!0}catch(e){return!1}},
/**
     * @Author: sonion
     * @msg: 移除cookie
     * @param {string} key cookie的key
     * @return {string}
     */
removeItem:function(e){return document.cookie="".concat(e,"=; expires=").concat(new Date(0).toUTCString())},
/**
     * @Author: sonion
     * @msg: 清空cookie
     * @return {undefined}
     */
clear:function(){for(var e=0,t=document.cookie.split("; ");e<t.length;e++){var r=t[e].split("=");this.removeItem(r[0])}}};t.cookie=r;t.createTokenManager=function(e,t){void 0===e&&(e="sessionStorage"),void 0===t&&(t="Bearer");var n={localStorage,sessionStorage,cookie:r}[e]||sessionStorage;return Object.defineProperties({_regExp:new RegExp("^".concat(t,"\\s+"))},{_token:{value:n.getItem("token"),writable:!0,enumerable:!1,configurable:!1},token:{get:function(){if(this._token)return"".concat(t," ").concat(this._token)},set:function(e){e&&(e=e.replace(this._regExp,""),this._token=e,n.setItem("token",e))}},rawToken:{get:function(){if(this._token)return this._token}},_refreshToken:{value:n.getItem("refreshToken"),writable:!0,enumerable:!1,configurable:!1},refreshToken:{get:function(){if(this._refreshToken)return"".concat(t," ").concat(this._refreshToken)},set:function(e){e&&(e=e.replace(this._regExp,""),this._refreshToken=e,n.setItem("refreshToken",e))}},rawRefreshToken:{get:function(){if(this._refreshToken)return this._refreshToken}}})}},60:function(e,t,r){var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.requestParamsAfterHandle=void 0;var o=r(547);
/**
 * @Author: sonion
 * @msg: 参数预处理完后，处理不涉及兼容性的参数处理
 * @param {string} url 请求地址
 * @param {object} options 请求参数 要求options.method处理完后调用
 * @param {function} isContentType - 判断contentType类型函数
 * @return {{url: string, options: object}} 返回GET状态下拼接完参数的url
 */t.requestParamsAfterHandle=function(e,t,r){var a;return(t=n({method:"GET",timeout:0,retryCount:0,maxRetries:0},t)).method=t.method.toUpperCase(),t.resType&&!["text","json","blob","arrayBuffer"].includes(t.resType)&&delete t.resType,"Object"===(0,o.getType)(t.body)&&("GET"===t.method?(e+="?"+(0,o.toParams)(t.body),delete t.body):t.headers&&(r(t.headers,"application/json")?a=JSON.stringify(t.body):r(t.headers,"application/x-www-form-urlencoded")&&(a=(0,o.toParams)(t.body)))),{url:e,options:n(n({},t),{body:a})}}},562:function(e,t,r){var n=this&&this.__spreadArray||function(e,t,r){if(r||2===arguments.length)for(var n,o=0,a=t.length;o<a;o++)!n&&o in t||(n||(n=Array.prototype.slice.call(t,0,o)),n[o]=t[o]);return e.concat(n||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0}),t.requestParamsHandle=t.createFormData=void 0;var o=r(60),a=function(e,t){return e.get("Content-Type").startsWith(t)};
/**
 * @Author: sonion
 * @msg: 判断content-type是否是某个值。如：application/json、application/x-www-form-urlencoded
 * @param {Headers} headers
 * @return {boolean}
 */t.requestParamsHandle=function(e,t){return(null==t?void 0:t.headers)&&(t.headers=new Headers(t.headers),t.headers.get("Content-Type")||t.headers.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8")),(0,o.requestParamsAfterHandle)(e,t,a)};t.createFormData=function(e){var t=new FormData;return Object.entries(e).forEach((function(e){var r=e[0],o=e[1];Array.isArray(o)?t.append.apply(t,n([r],o,!1)):t.append(r,o)})),t}},256:function(e,t,r){var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,a){function s(e){try{c(n.next(e))}catch(e){a(e)}}function i(e){try{c(n.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,i)}c((n=n.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var r,n,o,a,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(i){return function(c){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;a&&(a=0,i[0]&&(s=0)),s;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,n=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=t.call(e,s)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.getResponseType=t.createResponseTypeHandle=void 0,n(void 0,void 0,void 0,(function(){var e;return o(this,(function(t){switch(t.label){case 0:return"undefined"!=typeof TextDecoder?[3,2]:[4,Promise.resolve().then((function(){return r(494)}))];case 1:e=t.sent().MyTextDecoder,
// @ts-ignore
globalThis.TextDecoder=e,t.label=2;case 2:return[2]}}))}));
/**
 * @Author: sonion
 * @msg: 将包含ArrayBuffer的数组合并为一个ArrayBuffer
 * @param {ArrayBuffer[]} res - 包含ArrayBuffer的数组
 * @param {number} total - 多个ArrayBuffer的总长度
 * @return {ArrayBuffer}
 */
var a=function(e,t){if(1===(null==e?void 0:e.length))return e[0];var r=new Uint8Array(t),n=0;return e.forEach((function(e){r.set(new Uint8Array(e),n),n+=e.byteLength})),r.buffer};
/**
 * @Author: sonion
 * @msg: 创建'json'、'text'、'blob'三种返回格式的处理函数。第一个是push前的Decoder对象，第二个是最终返回处理函数
 * @param {'json'|'text'|'blob'} responseType
 * @return {[object, function]}
 */t.createResponseTypeHandle=function(e){var t;return t="text"===e||"json"===e?new TextDecoder("utf-8"):{decode:function(e){return e}},"text"===e?[t,function(e,t,r){return{status:e,data:t.join(""),headers:r}}]:"json"===e?[t,function(e,t,r){return{status:e,data:JSON.parse(t.join("")),headers:r}}]:"blob"===e?[t,function(e,t,r,n){return{status:e,data:"undefined"==typeof Blob?a(t,n):new Blob(t,{type:r.get("content-type")}),headers:r}}]:[t,function(e,t,r,n){return{status:e,data:a(t,n),headers:r}}]};t.getResponseType=function(e,t){return void 0===t&&(t=""),e||(t.startsWith("application/json")?"json":t.startsWith("text/")?"text":"arrayBuffer")}},59:function(e,t){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},r.apply(this,arguments)},n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,a){function s(e){try{c(n.next(e))}catch(e){a(e)}}function i(e){try{c(n.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,i)}c((n=n.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var r,n,o,a,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(i){return function(c){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;a&&(a=0,i[0]&&(s=0)),s;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,n=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=t.call(e,s)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.concurrencyRequest=t._requestRetry=void 0;t._requestRetry=function(e,t){return n(void 0,void 0,void 0,(function(){var n,a,s,i,c;return o(this,(function(o){switch(o.label){case 0:n=0,a=(null==e?void 0:e.maxRetries)||0,o.label=1;case 1:return o.trys.push([1,3,,4]),[4,t(e)];case 2:if("status"in(s=o.sent())&&200!==s.status)throw s;return[2,s];case 3:if(i=o.sent(),n>=a||(null===(c=null==e?void 0:e.cancel)||void 0===c?void 0:c.isCancelled)){if(i instanceof Error)throw r({code:-1,msg:i.message},i);return[2,i]}return[3,4];case 4:if(n++<a)return[3,1];o.label=5;case 5:return[2]}}))}))};var a=function(e,t,r,n){var o=t.shift(),s=o.url,i=o.options,c=e(s,i);r.push(c),t.length<=0?Promise.allSettled(r).then(n(r)):c.finally((function(){return a(e,t,r,n)}))};
/**
 * @Author: sonion
 * @msg: 并发控制函数
 * @param {RequestFunc} requestFunc - 请求方法
 * @param {Array} tasks - 请求参数对象数组
 * @param {number} maxNum - 最大并发数
 * @return {Promise<unknown>} - 返回请求Promise数组的Promise
 */t.concurrencyRequest=function(e,t,r){if(void 0===r&&(r=5),!Array.isArray(t))throw new Error("任务列表必须是一个数组");return 0===t.length?Promise.resolve([]):new Promise((function(n){for(var o=[],s=Math.min(r,t.length),i=0;i<s;i++)a(e,t,o,n)}))}},494:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MyTextDecoder=void 0;var n=r(547),o=new Uint16Array(32),a=/** @class */function(){function e(){}return e.prototype.decode=function(e){var t=e&&e.buffer||e;if(e&&!function(e){return["ArrayBuffer","Uint8Array","SharedArrayBuffer","Buffer"].includes((0,n.getType)(e))}(t))throw TypeError("Failed to execute 'decode' on 'TextDecoder': The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");for(var r="undefined"==typeof Buffer||!!Uint8Array&&Uint8Array.prototype.isPrototypeOf(Buffer.prototype)?new Uint8Array(t):t||[],a="",s="",i=0,c=0|r.length,u=c-32|0,l=0,f=0,d=0,p=0,h=0,y=0,v=-1;i<c;){for(l=i<=u?32:c-i|0;y<l;i=i+1|0,y=y+1|0){switch((f=255&r[i])>>4){case 15:if((h=255&r[i=i+1|0])>>6!=2||247<f){i=i-1|0;break}d=(7&f)<<6|63&h,p=5,f=256;case 14:d<<=6,d|=(15&f)<<6|63&(h=255&r[i=i+1|0]),p=h>>6==2?p+4|0:24,f=f+256&768;case 13:case 12:d<<=6,d|=(31&f)<<6|63&(h=255&r[i=i+1|0]),p=p+7|0,i<c&&h>>6==2&&d>>p&&d<1114112?(f=d,0<=(d=d-65536|0)?(v=55296+(d>>10)|0,f=56320+(1023&d)|0,y<31?(o[y]=v,y=y+1|0,v=-1):(h=v,v=f,f=h)):l=l+1|0):(i=i-(f>>=8)-1|0,f=65533),p=0,d=0,l=i<=u?32:c-i|0;default:o[y]=f;continue;case 11:case 10:case 9:case 8:}o[y]=65533}if(s+=String.fromCharCode(o[0],o[1],o[2],o[3],o[4],o[5],o[6],o[7],o[8],o[9],o[10],o[11],o[12],o[13],o[14],o[15],o[16],o[17],o[18],o[19],o[20],o[21],o[22],o[23],o[24],o[25],o[26],o[27],o[28],o[29],o[30],o[31]),y<32&&(s=s.slice(0,y-32|0)),i<c){if(o[0]=v,y=~v>>>31,v=-1,s.length<a.length)continue}else-1!==v&&(s+=String.fromCharCode(v));a+=s,s=""}return a},e}();t.MyTextDecoder=a},547:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.contentLengthRegExp=t.contentTypeRegExp=t.toParams=t.getType=void 0;t.toParams=function(e){if("undefined"!=typeof URLSearchParams){Object.entries(e).forEach((function(t){var r=t[0],n=t[1];return"object"==typeof n&&(e[r]=JSON.stringify(n))}));var t=new URLSearchParams(e);
// @ts-ignore
return t.sort(),decodeURIComponent(t.toString().replaceAll("+"," "))}return function(e){return Object.entries(e).sort((function(e,t){return"object"==typeof e[1]&&(e[1]=JSON.stringify(e[1])),"object"==typeof t[1]&&(t[1]=JSON.stringify(t[1])),e[0]<t[0]?-1:1})).map((function(e){return e.join("=")})).join("&")}(e)};var r=/^content-?type$/i;t.contentTypeRegExp=r;t.contentLengthRegExp=/^content-?length$/i;
/**
 * @Author: sonion
 * @msg: 获取headers对象中的contentType各种写法的名称
 * @param {object} headers
 * @return {string | undefined}
 */
var n=function(e){return null===e?"null":"object"!=typeof e?typeof e:Array.isArray(e)?"Array":Object.prototype.toString.call(e).replace(n.regExp,"$1")};
/**
 * @Author: sonion
 * @msg: 获取元素的数据类型
 * @param {any} anyData - 要获取类型的
 * @return {string} - 基本类型返回小写的类型字符串(同typeof)。数组返回'Array',其他引用类型返回Symbol.toStringTag属性值
 */t.getType=n,n.regExp=/^\[[a-z]+ ([A-Za-z]+)\]$/}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n].call(a.exports,a,a.exports,r),a.exports}var n={};(()=>{var e=n;Object.defineProperty(e,"__esModule",{value:!0}),e.concurrencyRequest=e.requestSse=e.createJsonp=e.requestJsonp=e.requestEasy=e.requestXhr=e.createResponsePreset=e.createInterceptorsPreset=e.createTokenManager=e.cookie=e.request=e.createFormData=e.toParams=void 0;var t=r(547);Object.defineProperty(e,"toParams",{enumerable:!0,get:function(){return t.toParams}});var o=r(343);Object.defineProperty(e,"cookie",{enumerable:!0,get:function(){return o.cookie}}),Object.defineProperty(e,"createTokenManager",{enumerable:!0,get:function(){return o.createTokenManager}});var a=r(746);Object.defineProperty(e,"request",{enumerable:!0,get:function(){return a.request}});var s=r(232);Object.defineProperty(e,"requestEasy",{enumerable:!0,get:function(){return s.requestEasy}}),Object.defineProperty(e,"requestXhr",{enumerable:!0,get:function(){return s.requestXhr}});var i=r(524);Object.defineProperty(e,"createJsonp",{enumerable:!0,get:function(){return i.createJsonp}}),Object.defineProperty(e,"requestJsonp",{enumerable:!0,get:function(){return i.requestJsonp}});var c=r(505);Object.defineProperty(e,"requestSse",{enumerable:!0,get:function(){return c.requestSse}});var u=r(199);Object.defineProperty(e,"createInterceptorsPreset",{enumerable:!0,get:function(){return u.createInterceptorsPreset}});var l=r(164);Object.defineProperty(e,"createResponsePreset",{enumerable:!0,get:function(){return l.createResponsePreset}});var f=r(562);Object.defineProperty(e,"createFormData",{enumerable:!0,get:function(){return f.createFormData}});var d=r(59);Object.defineProperty(e,"concurrencyRequest",{enumerable:!0,get:function(){return d.concurrencyRequest}})})(),module.exports=n})();