/**
 * @name IsArrowFunction
 * @author Kasukabe Tsumugi <futami16237@gmail.com>
 * @license MIT
 */

import { err, getOriginalToString, noSideEffectCall, strict } from './core';

const isArrowFunction = (fn: any, isStrict: boolean = false) => {
  const toString = getOriginalToString();

  if (typeof toString !== 'function') {
    return strict(isStrict, toString);
  }

  // 下面开始逐项测试
  // 1、是否为函数
  if (typeof fn !== 'function') {
    return strict(isStrict, `fn is not a function`);
  }

  const fnStr = toString.call(fn);
  // 其实前期已经在getOriginalToString中使用过toString.call，这里不太可能不是string
  // 严谨起见这里加上判定
  if (typeof fnStr !== 'string') {
    throw err(`[isArrowFunction] fn.toString() does not return a string`);
  }

  // 2、包裹参数的括号两侧的情况
  for (let i = 0; i < fnStr.length; i++) {
    const c = fnStr[i];
    if (c === '(') {
    }
  }
};

/**
 * 严格模式：判断是否为箭头函数，但是所有不是函数的情况将会报错
 */
function isArrowFunctionStrict(fn: any): boolean {
  if (typeof fn !== 'function') {
    throw new TypeError(
      '[isArrowFunction] 给的参数不是函数，无法判断是否为箭头函数。The parameter provided is not a function, cannot tell it is whether an arrow function'
    );
  }

  try {
    return noSideEffectCall(fn);
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message &&
      error.message.includes('is not a constructor')
    ) {
      return true;
    }
    console.error('[isArrowFunction]', 'fn:', fn);
    throw new Error('[isArrowFunction] 发生了未知错误。An unknown error occurred.');
  }
}

type JudgeFunction = (fn: any) => boolean;

interface StrictMode {
  /**
   * 严格模式：所有参数不是函数的情况将会报错
   * @param fn 给定的函数
   * @return boolean
   */
  strict: JudgeFunction;
}

type IsArrowFunctionJudger = JudgeFunction & StrictMode;

/**
 * 判断是否为箭头函数，不是箭头函数或不是函数的情形将返回false
 * @param fn 给定的函数
 * @return boolean
 */
const isArrowFunctione: IsArrowFunctionJudger = Object.assign(
  function (fn: any): boolean {
    if (typeof fn !== 'function') {
      return false;
    }
    try {
      return noSideEffectCall(fn);
    } catch (error) {
      return true;
    }
  },
  { strict: isArrowFunctionStrict }
);

export = isArrowFunction;
