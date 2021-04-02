module.exports = {
	"extends":  ["prettier", "plugin:prettier/recommended"],
	"parser": "babel-eslint",
	"globals": {
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
	"plugins": ["prettier"],
}