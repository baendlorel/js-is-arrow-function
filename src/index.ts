/**
 * @name IsArrowFunction
 * @author Kasukabe Tsumugi <futami16237@gmail.com>
 * @license MIT
 */

/**
 *
 */
function isArrowFunction(fn: any) {
  if (typeof fn !== 'function') {
    throw new TypeError(
      '[isArrowFunction] 给的参数不是函数，无法判断是否为箭头函数。The parameter provided is not a function, cannot tell it is whether an arrow function'
    );
  }

  // 经过研究，使用new操作符是最为确定的判断方法，箭头函数无法new
  // 此处用proxy拦截构造函数，防止普通函数真的作为构造函数运行
  // After some research, using new operator to distinct arrow functions from normal functions is the best approach.
  // We use proxy here to avoid truely running the constructor normal function(while arrow function cannot be newed)
  try {
    const fp = new Proxy(fn, {
      construct(target, args) {
        return {};
      },
    });
    new fp();
    return false;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message &&
      error.message.includes('is not a constructor')
    ) {
      return true;
    }
    console.error('[isArrowFunction]', 'fn:', fn);
    throw new Error('[isArrowFunction]判断发生未知错误');
  }
}

export = isArrowFunction;
