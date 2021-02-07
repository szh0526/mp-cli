/* eslint-disable*/
/**
 * js浮点数精度丢失问题及如何解决js中浮点数计算不精准
 * 处理 0.1 + 0.2 = 0.30000000000000004 的问题
 * 简易处理办法 toFixed， console.log(parseFloat(0.1+0.2).toFixed(1));
*/

/**
 * 加法函数
 * add(0.1,0.2); 输出0.6
 * @param {*} arg1
 * @param {*} arg2
 * @returns
 */
function add(arg1, arg2) {
  let r1
  let r2
  let m
  let n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2

  const result = parseFloat((((arg1 * m) + (arg2 * m)) / m).toFixed(n))
  
  // if((result).toString().length > 8){
  //   console.log("测试",parseFloat((((arg1 * m) + (arg2 * m)) / m).toFixed(n)))
  // }

  return result
}

/**
 * 减法函数
 * sub(0.3,0.1); 输出0.2
 * @param {*} arg1
 * @param {*} arg2
 * @returns
 */
function sub(arg1, arg2) {
  let r1
  let r2
  let m
  let n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2)) // 动态控制精度长度
  n = (r1 >= r2) ? r1 : r2

  return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n))
}

/**
 * 乘法函数
 * mul(0.3,0.2); 输出0.06
 * @param {*} arg1
 * @param {*} arg2
 * @returns
 */
function mul(arg1, arg2) {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}

  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
 * 除法函数
 * div(0.6,0.2); 输出3
 * @param {*} arg1
 * @param {*} arg2
 * @returns
 */
function div(arg1, arg2) {
  let t1 = 0
  let t2 = 0
  let r1
  let r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {}

  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))

  return (r1 / r2) * Math.pow(10, t2 - t1)
}

module.exports = {
  add,
  sub,
  mul,
  div,
}
