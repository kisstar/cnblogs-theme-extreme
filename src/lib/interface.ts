/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AnyFunction {
  (...arguments_: any[]): any;
}

export interface AnyObject {
  [prop: string]: any;
}
