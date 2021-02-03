module.exports = {
	"extends": "airbnb-base",

	"globals": {
		"__DEV__": true,
		"__WECHAT__": true,
		"App": true,
		"Page": true,
		"Component": true,
		"Behavior": true,
		"wx": true,
		"getApp": true,
		"getCurrentPages": true,
	},

	"rules": {
		"class-methods-use-this": "off",
		"no-underscore-dangle": "off",
		"linebreak-style": [0 ,"error", "windows"],
	 	"semi": [
			"error",
			"never",
		],
	},
}