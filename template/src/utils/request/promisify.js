module.exports = (fun) => (options, ...params) => new Promise((resolve, reject) => {
  fun({ ...options, success: resolve, fail: reject }, ...params)
})
