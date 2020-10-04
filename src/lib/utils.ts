import { AnyFunction, AnyObject } from './interface';

/**
 * @param {Function} method  The function to throttle
 * @param {Object} [context={}] The value to use as this when calling method
 * @param {number} [delay=0] The number of milliseconds to throttle invocations to
 * @returns {Function} Returns the new throttled function
 */
export function throttle(method: AnyFunction, context: AnyObject, delay: number): AnyFunction {
  let wait = false;
  return function wrappedhrottle() {
    if (!wait) {
      method.apply(context);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, delay);
    }
  };
}

export default { throttle };
