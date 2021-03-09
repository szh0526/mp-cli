const request = require('../utils/request/index')

module.exports = {
  getUserInfo: () => request.get({
    url: 'client?appId=thunder&functionId=FxUserRelJsfService.getUserInfo',
    data: {
      body: {},
    },
  }),
}
