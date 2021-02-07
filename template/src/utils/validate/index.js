const callType = (type, value) => Object.prototype.toString.call(value) === `[object ${type}]`

const isNumber = (val) => {
  const re = /^[0-9]*[0-9]$/i // 校验是否为数字
  if (re.test(val)) {
    return true
  }
  return false
}

module.exports = {
  isNumber,
  isArray: (value) => callType('Array', value),
  isString: (value) => callType('String', value),
  isFunction: (value) => callType('Function', value),
  isRegExp: (value) => callType('RegExp', value),
  isObject: (value) => callType('Object', value),
  isEmptyObject: (value) => callType('Object', value) && Object.keys(value).length === 0,
  // arrLike 类数组 如：arguments
  transArray: (arrLike) => Array.prototype.slice.call(arrLike),
  isError: (obj) => obj && obj instanceof Error,
  // 判断是数组或对象 typeof {} typeof [] typeof null 返回 'object'
  isObjectOrArray: (obj) => typeof obj === 'object' && obj != null,
  isLimit: (max) => (num) => num > max,
  isPhone: (str) => /^1([358][0-9]|4[579]|66|7[0135678]|9[89])\d{8}$/.test(str),
  isEmptyString: (str) => str === '' || str === null || str === undefined,
}
