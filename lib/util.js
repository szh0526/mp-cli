/* eslint-disable*/

/** 深度合并 */
function deepMerge(target, source) {
  if (
    toString.call(target) === "[object Object]" &&
    toString.call(source) === "[object Object]"
  ) {
    for (const key in source) {
      if (!target[key]) {
        target[key] = source[key];
      } else {
        target[key] = deepMerge(target[key], source[key]); // 递归赋值
      }
    }
  } else if (
    toString.call(target) === "[object Array]" &&
    toString.call(source) === "[object Array]"
  ) {
    // 数组进行合并
    target = target.concat(source);
  } else {
    target = source;
  }
  return target;
}

module.exports = {
  deepMerge,
};
