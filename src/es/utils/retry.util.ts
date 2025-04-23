import type { RequestOptionsHttp, ProcessedOptions, RequestMainFuncHttpXhrWx, RequestMainFunc, 
  Requestor, RequestOptions, RequestPromiseReturned } from "../../types";


// node:http、xhr内部函数_sendRequest的类型
type _requestRetryFunc = (
  options: RequestOptionsHttp | ProcessedOptions,
  _requestMain: RequestMainFuncHttpXhrWx
)=>ReturnType<RequestMainFunc>;

/**
 * @Author: sonion
 * @msg: node:http、xhr基础封装，重试部分。在内部调_request
 * @param {string} url 请求地址
 * @param {object} options 请求参数集
 * @return {promise} 返回promise对象
 */
const _requestRetry: _requestRetryFunc = async (options, _requestMain) => {
  let retryCount = 0; // 已重试次数
  const maxRetries = options?.maxRetries || 0; // 最大重试次数，默认值0，不重试。后面数值比较才不会出错
  do {
    try {
      const response = await _requestMain(options);
      if ('status' in response && response.status !== 200) throw response; 
      return response; // 只有正常返回才用resolve,所以这里的都是正确的
    } catch (err) {
      // 因为用的>=所以都是0的时候就结束返回了
      if (retryCount >= maxRetries || options?.cancel?.isCancelled) {
        if (err instanceof Error) throw {code: -1, msg: err.message, ...err}; // 重试后依然失败、手动取消 直接跳出
        else return err; // 服务端错误，重定向到then
      }
    }
  } while (retryCount++ < maxRetries);
};


// 任务数组类型
type TaskList = {url: string, options: RequestOptions}[];
// _run函数类型
type _RunFunc<T> = (requestFunc: Requestor, tasks: TaskList, resultList: T, resolve: (value: T) => any)=>void

const _run: _RunFunc<RequestPromiseReturned[]> = (requestFunc, tasks, resultList, resolve)=>{
  const { url, options } = tasks.shift()
  const task = requestFunc(url, options)
  resultList.push(task);
  if (tasks.length <= 0) {
    Promise.allSettled(resultList).then(resolve(resultList))
    return;
  };
  task.finally(()=>_run(requestFunc, tasks, resultList, resolve))
}

// 并发控制函数类型
export type concurrencyRequestor = (requestFunc: Requestor, tasks: TaskList, maxNum: number)=>Promise<RequestPromiseReturned[]>;

/**
 * @Author: sonion
 * @msg: 并发控制函数
 * @param {Requestor} requestFunc - 请求方法
 * @param {Array} tasks - 请求参数对象数组
 * @param {number} maxNum - 最大并发数
 * @return {Promise<unknown>} - 返回请求Promise数组的Promise
 */
const concurrencyRequest: concurrencyRequestor = (requestFunc: Requestor, tasks, maxNum: number = 5)=>{
  if (!Array.isArray(tasks)) throw new Error('任务列表必须是一个数组');
  if (tasks.length === 0) return Promise.resolve([]);
  return new Promise(resolve=>{
    const resultList = []; // 结果数组
    const min = Math.min(maxNum, tasks.length); // 考虑任务数如果本就小于最大任务数
    for(let i = 0; i < min; i++){
      _run(requestFunc, tasks, resultList, resolve);
    }
  }) as ReturnType<concurrencyRequestor>
}


interface ConcurrencyController {
  <T>(signal: AbortSignal, tasks: (() => T)[], concurrency?: number): Promise<
    PromiseSettledResult<Awaited<T>>[]
  >;
  <T, R>(
    signal: AbortSignal,
    tasks: (() => T)[],
    concurrency: number,
    handler: (value: Awaited<T>) => R,
  ): Promise<PromiseSettledResult<Awaited<R>>[]>;
}
/**
 * @Author: sonion
 * @msg: 并发控制函数
 * @param {AbortSignal} signal - 取消信号
 * @param {Array} tasks - 请求参数对象数组
 * @param {number} [concurrency=5] - 最大并发数
 * @param {Function} [handler] - 处理函数。如有该参数，下一个任务以该函数返回promise完成为准
 * @return {Promise<PromiseSettledResult<T>[]>} - 返回请求Promise数组的Promise
 */
const concurrencyController: ConcurrencyController = <T, R>(
  signal: AbortSignal,
  tasks: (() => T)[],
  concurrency = 5,
  handler?: (value: Awaited<T>) => R,
) =>
  new Promise<PromiseSettledResult<Awaited<T | R>>[]>((resolve, reject) => {
    if (!Array.isArray(tasks)) {
      reject(new Error('任务列表必须是一个数组'));
    }
    if (tasks.length <= 0) {
      resolve([]);
    }
    const results: Promise<T | R>[] = [];
    let running = 0; // 已执行任务数
    let finishedCount = 0; // 已完成任务数
    const _runTask = (i: number) => {
      if (i > tasks.length - 1 || signal?.aborted) {
        return;
      }
      const res = Promise.resolve(tasks[i]());
      results[i] = handler ? res.then(handler) : res;
      results[i].finally(() => {
        if (++finishedCount > tasks.length - 1) {
          resolve(Promise.allSettled(results));
        } else {
          _runTask(running++);
        }
      });
    };
    const min = Math.min(concurrency, tasks.length); // 任务数小于最大任务数
    while (running < min) {
      _runTask(running++);
    }
  });


export {
  _requestRetry,
  concurrencyRequest,
  concurrencyController
}
