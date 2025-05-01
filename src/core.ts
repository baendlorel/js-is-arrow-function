export const err = (message: string) => {
  return new Error('[isArrowFunction] ' + message);
};

export const strict = (isStrict: boolean, message: string) => {
  if (isStrict) {
    throw err(message);
  } else {
    console.warn('[isArrowFunction] ' + message);
    return false;
  }
};

let toString = null as (() => string) | null;
export const getOriginalToString = (): (() => string) | string => {
  if (toString !== null) {
    return toString;
  }

  const origin = Function.prototype.toString;

  if (typeof origin !== 'function') {
    return 'Function.prototype.toString is not a function. It is definitly been tampered!';
  }

  if (typeof origin.call !== 'function') {
    return 'Function.prototype.toString.call is not a function. It is definitly been tampered!';
  }

  const toStringStr = origin.call(origin);

  if (typeof toStringStr !== 'string') {
    return 'Function.prototype.toString.toString() is not a string. It is definitly been tampered!';
  }

  if (
    toStringStr !== `function toString() { [native code] }` &&
    toStringStr.indexOf('native code') === -1
  ) {
    return 'Function.prototype.toString.toString() is not native code. It is definitly been tampered!';
  }

  toString = origin;
  return origin;
};

export const analyzeFunction = (fnStr: string) => {
  let leftBracketIndex = -1;
  let rightBracketIndex = -1;
  let bracketLevel = 0;

  // 可以合法出现单边括号的地方有
  // 字符串内部、正则表达式、注释文本
  for (let i = 0; i < fnStr.length; i++) {
    const c = fnStr[i];
    if (c === '(') {
      bracketLevel++;
      if (bracketLevel === 1 && leftBracketIndex === -1) {
        leftBracketIndex = i;
      }
      continue;
    }

    if (c === ')' && leftBracketIndex !== -1) {
      bracketLevel--;
      if (bracketLevel === 0 && rightBracketIndex === -1) {
        rightBracketIndex = i;
        break;
      }
      continue;
    }
  }

  // 解析三个部分
  const name = fnStr.slice(0, leftBracketIndex).trim();
  const params = fnStr.slice(leftBracketIndex + 1, rightBracketIndex).trim();
  const body = fnStr.slice(rightBracketIndex + 1).trim();

  // 返回解析结果
  return { name, params, body };
};

/**
 * 经过研究，使用new操作符是最为确定的判断方法，箭头函数无法new \
 * 此处用proxy拦截构造函数，防止普通函数真的作为构造函数运行 \
 * After some research, using new operator to distinct arrow functions from normal functions is the best approach. \
 * We use proxy here to avoid truely running the constructor normal function(while arrow function cannot be newed)
 * @param fn
 * @returns
 */
export const noSideEffectCall = (fn: any) => {
  const fp = new Proxy(fn, {
    construct(target, args) {
      return {};
    },
  });
  new fp();
  return false;
};
