/*
 * 公共方法
 */
const number = require('./number')

const isObjectOrArray = (obj) => typeof obj === 'object' && obj != null

const sortFn = (propertyName) => (object1, object2) => {
  const value1 = object1[propertyName]
  const value2 = object2[propertyName]

  if (value1 < value2) {
    return -1
  }
  if (value1 > value2) {
    return 1
  }
  return 0
}

// 深拷贝 JSON.parse(JSON.stringify(a))
const cloneDeep = (source, hash = new WeakMap()) => {
  if (!isObjectOrArray(source)) return source
  if (hash.has(source)) return hash.get(source) // 查哈希表
  const target = Array.isArray(source) ? [...source] : { ...source }
  hash.set(source, target) // 哈希表设值
  Reflect.ownKeys(target).forEach((key) => {
    target[key] = isObjectOrArray(source[key])
      ? cloneDeep(source[key], hash)
      : source[key]
  })
  return target
}

const formatNumber = (n) => {
  const num = n.toString()
  return num[1] ? num : `0${num}`
}

const getCountDownTime = (startDate, endDate) => {
  if (
    !startDate
    || Object.prototype.toString.call(startDate) !== '[object Date]'
  ) {
    throw new Error('startDate was wrong type')
  }
  if (!endDate || Object.prototype.toString.call(endDate) !== '[object Date]') {
    throw new Error('endDate was wrong type')
  }
  const start = startDate.getTime()
  const end = endDate.getTime()
  return start - end
}

const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(':')}`
}

const formatTimeToStr = (time) => {
  const date = new Date(time)
  const o = {
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
  }
  const _h = o.h >= 1 // 如果大于1小时则展示小时
  return `${
    (_h ? `${o.h < 10 ? `0${o.h}` : o.h}:` : '') + (o.m < 10 ? `0${o.m}` : o.m)
  }:${o.s < 10 ? `0${o.s}` : o.s}`
}

/** 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * formatDate("yyyy-MM-dd hh:mm:ss.S", date) ==> 2006-07-02 08:09:04.423
 * formatDate("yyyy-M-d h:m:s.S", date)      ==> 2006-7-2 8:9:4.18
 * */
const formatDate = (fmt, date) => {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length),
    )
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      )
    }
  }
  return fmt
}

module.exports = {
  ...number,
  sortFn,
  cloneDeep,
  formatDate,
  getCountDownTime,
  formatTimeToStr,
  formatNumber,
  formatTime,
}
