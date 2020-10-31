import { AnyFunction, AnyObject } from './interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function noop(...arguments_: any[]): any {}

/**
 * @param {Function} method  The function to throttle
 * @param {Object} [context={}] The value to use as this when calling method
 * @param {number} [delay=0] The number of milliseconds to throttle invocations to
 * @returns {Function} Returns the new throttled function
 */
export function throttle(method: AnyFunction, delay = 0, context: AnyObject = {}): AnyFunction {
  let wait = false;
  return function wrappedThrottle() {
    if (!wait) {
      method.call(context);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, delay);
    }
  };
}

/**
 * @param {Function} method  The function to debounce
 * @param {Object} [context={}] The value to use as this when calling method
 * @param {number} [delay=0] The number of milliseconds to debounce invocations to
 * @returns {Function} Returns the new debounced function
 */
export function debounce(method: AnyFunction, delay = 0, context: AnyObject = {}): AnyFunction {
  let tId = 0;
  return function wrappedDebounce() {
    clearTimeout(tId);
    tId = window.setTimeout(() => {
      method.call(context);
    }, delay);
  };
}

/**
 * @description
 * 向系统粘贴板写入内容
 * 有两种方式可以让浏览器扩展与系统剪贴板交互: Document.execCommand() 方法以及现代的异步的 Clipboard API
 * 前者现在已过时，尽管它在某些浏览器中仍然可以工作，但最好尽量避免使用它
 * @param {string} source 写入系统粘贴板的内容
 * @returns {boolean} 是否写入成功
 */
export async function copy(source: string): Promise<boolean> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(source);
    return true;
  }

  if (document.execCommand) {
    const $input = $(`<input  value=${source} type="hidden"/>`);
    ($input.appendTo($('body')).get(0) as HTMLInputElement).select();
    const result = document.execCommand('Copy');
    $input.remove();
    return result;
  }

  return false;
}

/**
 * @description
 * 确保指定的任务在指定条件下执行
 * @param {Function} condition 得到条件的函数
 * @param {Function} fn 将被执行的任务
 * @param {object} context 任务的执行上下文，默认是一个空对象
 * @param {any[]} rest 剩余参数
 */
export function ensureAsync(
  condition: AnyFunction,
  fn: AnyFunction,
  context = {},
  ...rest: unknown[]
): void {
  (function task() {
    if (condition()) {
      fn.call(context, ...rest);
    } else {
      setTimeout(task);
    }
  })();
}
