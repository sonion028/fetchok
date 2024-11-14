(()=>{"use strict";var e={116:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createInterceptor=void 0;t.createInterceptor=function(e){var t=this;return function(){for(var r,n,o,a=[],s=0;s<arguments.length;s++)a[s]=arguments[s];if(e.request?(n=(r=e.request.apply(e,a))[0],o=r[1]):(n=a[0],o=a[1]),!a[1].cancel&&(null==o?void 0:o.cancel)&&console.warn("在请求拦截器中添加的cancel参数可能外部读取不到，不能手动取消哟"),!n)throw{code:-1,msg:"请求拦截器需要返回一个对象。url属性必填, options属性可选"};return t(n,o).then((function(t){if(e.response){var r=e.response(t);if(null==r)throw{code:-1,msg:"响应拦截器必须返回不为空的数据"};return r}return t})).catch((function(t){throw e.catch&&e.catch(t),t})).finally((function(){e.finally&&e.finally()}))}}},880:function(e,t,r){var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)},o=this&&this.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};Object.defineProperty(t,"__esModule",{value:!0}),t.createResponsePreset=void 0;var a=r(547);
/**
 * @Author: sonion
 * @msg: 创建响应拦截器预设
 * @param {RequestSuccessCallback} [callback] - 可以传一个函数，会传入响应值。会返回该函数返回值，如没有则返回服务端响应值
 * @return {RespInterceptors}
 */t.createResponsePreset=function(e){return{response:function(t){var r,s,i,u=t.status,c=t.headers,l=o(t,["status","headers"]),f=e&&e(n({status:u,headers:c},l));if(u<200||u>=300)throw{code:-1,msg:(null==l?void 0:l.msg)||(null===(r=null==l?void 0:l.data)||void 0===r?void 0:r.msg)||"网络请求错误"};if("data"in l&&"Object"===(0,a.getType)(l.data)&&((null===(s=l.data)||void 0===s?void 0:s.code)||!(null===(i=l.data)||void 0===i?void 0:i.data)))throw l.data;return f||l.data},catch:function(e){throw n({code:-1,msg:e.message},e)}}}},355:function(e,t,r){var n=this&&this.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};Object.defineProperty(t,"__esModule",{value:!0}),t.request=void 0;var o,a=r(116),s=r(329),i=r(547),u=r(59),c=r(256),l=(o="ALLOW_PROGRESS",Object.defineProperties({get allow(){return this._allow},set allow(e){this._allow=e,wx.setStorageSync(o,e)}},{_allow:{value:wx.getStorageSync(o)||!0,writable:!0,enumerable:!1,configurable:!1}})),f=function(e){var t,r=e.url,o=e.headers,a=e.body,u=e.cancel,f=e.onProgress,d=e.resType,p=n(e,["url","headers","body","cancel","onProgress","resType"]);return new Promise((function(e,n){var y={total:0,pending:[],responseBody:[],status:void 0,headers:void 0,responseDecoder:void 0,resultHandler:void 0};if(p.url=r,p.header=o,p.data=a,"json"===d?p.dataType="json":p.responseType="blob"===d?"arraybuffer":"text",p.success=function(t){var r,o=t.statusCode,a=t.data,s=t.header;if(p.enableChunked){if(y.pending.length&&((r=y).pending.length&&(r.responseBody=r.pending.map((function(e){return r.responseDecoder.decode(e)})).concat(r.responseBody)),delete r.pending),!y.responseBody.length)return l.allow=!1,void n({code:600098,msg:"用了进度，onChunkReceived没有触发。该bug，需向微信反馈"});e(y.resultHandler(y.status,y.responseBody,new Map(Object.entries(y.headers)),y.total))}else e({status:o,headers:new Map(Object.entries(s)),data:a})},p.fail=function(e){var t=e.errno,r=e.errMsg;return n({code:t||-1,msg:r})},l.allow&&f&&(p.enableChunked=!0),t=wx.request(p),u&&(u.abort=function(){t.abort(),u.isCancelled=!0,n({code:600099,msg:"手动取消"})}),p.enableChunked){var h=0,v=0;t.onHeadersReceived((function(t){var r,n=t.header,o=t.statusCode;if(200===o){y.status=o,y.headers=n;var a=function(e){return i.contentTypeRegExp.test(e)},u=function(e){return i.contentLengthRegExp.test(e)},l=(0,s.getObjectHeadersKey)(n,[a,u]);v=y.total=+n[l.get(u)]||y.total;var f=(0,c.getResponseType)(d,n[l.get(a)]);r=(0,c.createResponseTypeHandle)(f),y.responseDecoder=r[0],y.resultHandler=r[1]}else e({status:o,headers:n,msg:"网络请求失败"})})),t.onChunkReceived((function(e){var t=e.data;y.responseDecoder?y.responseBody.push(y.responseDecoder.decode(t)):y.pending.push(t),v&&f(h+=t.byteLength,y.total),y.total=y.total>h?y.total:h}))}})).finally((function(){t&&(t.offChunkReceived(),t.offHeadersReceived())}))},d=function(e,t){var r,n;return e=(r=(0,s.requestParamsHandle)(e,t)).url,(n=r.options).url=e,l.allow&&0===n.maxRetries?n.maxRetries=1:!l.allow&&n.onProgress&&delete n.onProgress,(0,u._requestRetry)(n,f)};t.request=d,
/**
 * @Author: sonion
 * @msg: 创建一个具有拦截器的 wx.request 请求
 * @param { Interceptor } interceptors - 拦截器对象
 * @param { Interceptor['request'] } [interceptors.request] - 请求拦截器，传入请求参数数组。请求拦截器必须返回一个包含url和options的对象
 * @param { Interceptor['response'] } [interceptors.response] - 响应拦截器，传入响应数据。返回值不可为空
 * @param { Interceptor['catch'] } [interceptors.catch] - 失败拦截器，传入错误对象。
 * @param { Interceptor['finally'] } [interceptors.finally] - 成功失败都会运行的拦截器，没有传入值。
 * @return { RequestMainFunc } 返回使用了拦截器的请求函数。参数和requestXhr方法一样。
 */
d.create=function(e){return void 0===e&&(e={}),a.createInterceptor.call(d,e)}},60:function(e,t,r){var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.requestParamsAfterHandle=void 0;var o=r(547);
/**
 * @Author: sonion
 * @msg: 参数预处理完后，处理不涉及兼容性的参数处理
 * @param {string} url 请求地址
 * @param {object} options 请求参数 要求options.method处理完后调用
 * @param {function} isContentType - 判断contentType类型函数
 * @return {{url: string, options: object}} 返回GET状态下拼接完参数的url
 */t.requestParamsAfterHandle=function(e,t,r){var a;return(t=n({method:"GET",timeout:0,retryCount:0,maxRetries:0},t)).method=t.method.toUpperCase(),t.resType&&!["text","json","blob","arrayBuffer"].includes(t.resType)&&delete t.resType,"Object"===(0,o.getType)(t.body)?"GET"===t.method?(e+="?"+(0,o.toParams)(t.body),delete t.body):t.headers&&(r(t.headers,"application/json")?a=JSON.stringify(t.body):r(t.headers,"application/x-www-form-urlencoded")&&(a=(0,o.toParams)(t.body))):t.body&&(a=t.body),{url:e,options:n(n({},t),{body:a})}}},329:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.requestParamsHandle=t.getObjectHeadersKey=void 0;var n=r(547),o=r(60),a=function(e,t){var r=new Map;return Object.keys(e).forEach((function(e){t.forEach((function(t){return t(e)&&r.set(t,e)}))})),r};t.getObjectHeadersKey=a;t.requestParamsHandle=function(e,t){var r;if(null==t?void 0:t.headers){var s=function(e){return n.contentTypeRegExp.test(e)},i=a(t.headers,[s]).get(s);t.body instanceof FormData?Reflect.deleteProperty(t.headers,i):t.headers[i]||(t.headers["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8"),r=function(e,t){return o=t,!!(r=e)[n=i]&&r[n].startsWith(o);var r,n,o}}return(0,o.requestParamsAfterHandle)(e,t,r)}},256:function(e,t,r){var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,a){function s(e){try{u(n.next(e))}catch(e){a(e)}}function i(e){try{u(n.throw(e))}catch(e){a(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,i)}u((n=n.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var r,n,o,a,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(i){return function(u){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;a&&(a=0,i[0]&&(s=0)),s;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,n=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=t.call(e,s)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.getResponseType=t.createResponseTypeHandle=void 0,n(void 0,void 0,void 0,(function(){var e;return o(this,(function(t){switch(t.label){case 0:return"undefined"!=typeof TextDecoder?[3,2]:[4,Promise.resolve().then((function(){return r(494)}))];case 1:e=t.sent().MyTextDecoder,
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
 */t.createResponseTypeHandle=function(e){var t;return t="text"===e||"json"===e?new TextDecoder("utf-8"):{decode:function(e){return e}},"text"===e?[t,function(e,t,r){return{status:e,data:t.join(""),headers:r}}]:"json"===e?[t,function(e,t,r){return{status:e,data:JSON.parse(t.join("")),headers:r}}]:"blob"===e?[t,function(e,t,r,n){return{status:e,data:void 0===typeof Blob?a(t,n):new Blob(t,{type:r.get("content-type")}),headers:r}}]:[t,function(e,t,r,n){return{status:e,data:a(t,n),headers:r}}]};t.getResponseType=function(e,t){return void 0===t&&(t=""),e||(t.startsWith("application/json")?"json":t.startsWith("text/")?"text":"arrayBuffer")}},59:function(e,t){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},r.apply(this,arguments)},n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,a){function s(e){try{u(n.next(e))}catch(e){a(e)}}function i(e){try{u(n.throw(e))}catch(e){a(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,i)}u((n=n.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var r,n,o,a,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(i){return function(u){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;a&&(a=0,i[0]&&(s=0)),s;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,n=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=t.call(e,s)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(t,"__esModule",{value:!0}),t.concurrencyRequest=t._requestRetry=void 0;t._requestRetry=function(e,t){return n(void 0,void 0,void 0,(function(){var n,a,s,i,u;return o(this,(function(o){switch(o.label){case 0:n=0,a=(null==e?void 0:e.maxRetries)||0,o.label=1;case 1:return o.trys.push([1,3,,4]),[4,t(e)];case 2:if("status"in(s=o.sent())&&200!==s.status)throw s;return[2,s];case 3:if(i=o.sent(),n>=a||(null===(u=null==e?void 0:e.cancel)||void 0===u?void 0:u.isCancelled)){if(i instanceof Error)throw r({code:-1,msg:i.message},i);return[2,i]}return[3,4];case 4:if(n++<a)return[3,1];o.label=5;case 5:return[2]}}))}))};var a=function(e,t,r,n){var o=t.shift(),s=o.url,i=o.options,u=e(s,i);r.push(u),t.length<=0?Promise.allSettled(r).then(n(r)):u.finally((function(){return a(e,t,r,n)}))};
/**
 * @Author: sonion
 * @msg: 并发控制函数
 * @param {Requestor} requestFunc - 请求方法
 * @param {Array} tasks - 请求参数对象数组
 * @param {number} maxNum - 最大并发数
 * @return {Promise<unknown>} - 返回请求Promise数组的Promise
 */t.concurrencyRequest=function(e,t,r){if(void 0===r&&(r=5),!Array.isArray(t))throw new Error("任务列表必须是一个数组");return 0===t.length?Promise.resolve([]):new Promise((function(n){for(var o=[],s=Math.min(r,t.length),i=0;i<s;i++)a(e,t,o,n)}))}},494:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MyTextDecoder=void 0;var n=r(547),o=new Uint16Array(32),a=/** @class */function(){function e(){}return e.prototype.decode=function(e){var t=e&&e.buffer||e;if(e&&!function(e){return["ArrayBuffer","Uint8Array","SharedArrayBuffer","Buffer"].includes((0,n.getType)(e))}(t))throw TypeError("Failed to execute 'decode' on 'TextDecoder': The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");for(var r="undefined"==typeof Buffer||!!Uint8Array&&Uint8Array.prototype.isPrototypeOf(Buffer.prototype)?new Uint8Array(t):t||[],a="",s="",i=0,u=0|r.length,c=u-32|0,l=0,f=0,d=0,p=0,y=0,h=0,v=-1;i<u;){for(l=i<=c?32:u-i|0;h<l;i=i+1|0,h=h+1|0){switch((f=255&r[i])>>4){case 15:if((y=255&r[i=i+1|0])>>6!=2||247<f){i=i-1|0;break}d=(7&f)<<6|63&y,p=5,f=256;case 14:d<<=6,d|=(15&f)<<6|63&(y=255&r[i=i+1|0]),p=y>>6==2?p+4|0:24,f=f+256&768;case 13:case 12:d<<=6,d|=(31&f)<<6|63&(y=255&r[i=i+1|0]),p=p+7|0,i<u&&y>>6==2&&d>>p&&d<1114112?(f=d,0<=(d=d-65536|0)?(v=55296+(d>>10)|0,f=56320+(1023&d)|0,h<31?(o[h]=v,h=h+1|0,v=-1):(y=v,v=f,f=y)):l=l+1|0):(i=i-(f>>=8)-1|0,f=65533),p=0,d=0,l=i<=c?32:u-i|0;default:o[h]=f;continue;case 11:case 10:case 9:case 8:}o[h]=65533}if(s+=String.fromCharCode(o[0],o[1],o[2],o[3],o[4],o[5],o[6],o[7],o[8],o[9],o[10],o[11],o[12],o[13],o[14],o[15],o[16],o[17],o[18],o[19],o[20],o[21],o[22],o[23],o[24],o[25],o[26],o[27],o[28],o[29],o[30],o[31]),h<32&&(s=s.slice(0,h-32|0)),i<u){if(o[0]=v,h=~v>>>31,v=-1,s.length<a.length)continue}else-1!==v&&(s+=String.fromCharCode(v));a+=s,s=""}return a},e}();t.MyTextDecoder=a},547:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.contentLengthRegExp=t.contentTypeRegExp=t.toParams=t.getType=void 0;t.toParams=function(e){if("undefined"!=typeof URLSearchParams){Object.entries(e).forEach((function(t){var r=t[0],n=t[1];return"object"==typeof n&&(e[r]=JSON.stringify(n))}));var t=new URLSearchParams(e);
// @ts-ignore
return t.sort(),decodeURIComponent(t.toString().replaceAll("+"," "))}return function(e){return Object.entries(e).sort((function(e,t){return"object"==typeof e[1]&&(e[1]=JSON.stringify(e[1])),"object"==typeof t[1]&&(t[1]=JSON.stringify(t[1])),e[0]<t[0]?-1:1})).map((function(e){return e.join("=")})).join("&")}(e)};var r=/^content-?type$/i;t.contentTypeRegExp=r;t.contentLengthRegExp=/^content-?length$/i;
/**
 * @Author: sonion
 * @msg: 获取headers对象中的contentType各种写法的名称 暂时没用
 * @param {object} headers
 * @return {string | undefined}
 */
var n,o=(n=/^\[[a-z]+ ([A-Za-z]+)\]$/,function(e){return null===e?"null":"object"!=typeof e?typeof e:Array.isArray(e)?"Array":Object.prototype.toString.call(e).replace(n,"$1")});t.getType=o},360:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.promisic=void 0;t.promisic=function(e){return function(t){return void 0===t&&(t={}),new Promise((function(r,n){t.success=function(e){r(e)},t.fail=function(e){n(e)},e(t)}))}}}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n].call(a.exports,a,a.exports,r),a.exports}var n={};(()=>{var e=n;Object.defineProperty(e,"__esModule",{value:!0}),e.concurrencyRequest=e.promisic=e.createResponsePreset=e.request=e.toParams=void 0;var t=r(547);Object.defineProperty(e,"toParams",{enumerable:!0,get:function(){return t.toParams}});var o=r(355);Object.defineProperty(e,"request",{enumerable:!0,get:function(){return o.request}});var a=r(880);Object.defineProperty(e,"createResponsePreset",{enumerable:!0,get:function(){return a.createResponsePreset}});var s=r(360);Object.defineProperty(e,"promisic",{enumerable:!0,get:function(){return s.promisic}});var i=r(59);Object.defineProperty(e,"concurrencyRequest",{enumerable:!0,get:function(){return i.concurrencyRequest}})})(),module.exports=n})();