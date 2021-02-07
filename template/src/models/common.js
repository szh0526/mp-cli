const request = require('../utils/request/index')

module.exports = {
  // 登陆
  login: (data) => request.get({
    url: 'login',
    data,
  }),
}
