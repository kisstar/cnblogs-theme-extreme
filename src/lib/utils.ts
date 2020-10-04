import { AnyFunction, AnyObject } from './interface';

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
