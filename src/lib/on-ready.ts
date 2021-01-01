import { AnyFunction } from './interface';
import { ensureAsync } from './utils';

interface ReadyMap {
  [prop: string]: boolean;
}

interface CallbackInfo {
  deps: string[];
  cb: AnyFunction;
  called: boolean;
}

type ReadyParameter = (string | AnyFunction)[];

const readyMap: ReadyMap = {};
let queue: CallbackInfo[] = [];
let state: 'PENDING' | 'RESOLVED' = 'RESOLVED'; // 当前状态

function executeCore() {
  if (queue.length === 0) return;

  queue.forEach((callbackInfo) => {
    if (callbackInfo.deps.every((selector) => readyMap[selector])) {
      callbackInfo.cb();
      callbackInfo.called = true; // eslint-disable-line no-param-reassign
    }
  });
  queue = queue.filter((callbackInfo) => !callbackInfo.called);
}

// 异步执行队列
function executeCallback() {
  if (state === 'PENDING') return;

  state = 'PENDING';
  Promise.resolve()
    .then(() => {
      executeCore();
      state = 'RESOLVED';
      return true;
    })
    .catch(() => false);
}

function onReady(...arguments_: ReadyParameter): void {
  const callback = arguments_.pop();
  const hasCallback = $.isFunction(callback);
  let isReady = true;

  if (arguments_.length === 0) {
    // 如果只接受到一个函数，那么直接执行
    if (hasCallback) {
      (callback as AnyFunction)();
      return;
    }
    if (typeof callback !== 'string') {
      return;
    }

    arguments_.push(callback);
  }

  // 确保对应选择的项准备好后更新映射表，并触发回调执行
  arguments_.forEach((selector) => {
    if (readyMap[selector as string]) {
      return;
    }

    isReady = false;
    ensureAsync(
      () => $(selector).get(0),
      () => {
        readyMap[selector as string] = true;
        executeCallback();
      },
    );
  });

  if (hasCallback) {
    queue.push({
      deps: arguments_ as string[],
      cb: callback as AnyFunction,
      called: false,
    });

    if (isReady || state !== 'PENDING') executeCallback();
  }
}

export default onReady;
