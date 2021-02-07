const STORAGE_KEYS = {
  // 登录token(pin)
  AUTH_TOKEN: 'auth_token',
  // 用户pin
  PIN: 'pin',
  // 员工pin
  JL_PIN: 'jl_pin',
  // 门店id
  STOREID: 'store_id',
  // openId
  OPEN_ID: 'open_id',
  // 第三方平台自定义配置文件（积理studio）
  EXT_CONFIG: 'ext_config',
  // 全链路日志跟踪ID
  TRACEID: 'traceId',
}

const JSF_IMG_PREFIX = 'https://m.360buyimg.com/img/'

module.exports = {
  STORAGE_KEYS,
  JSF_IMG_PREFIX,
}
