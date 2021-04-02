module.exports = {
	"extends":  ["eslint-config-airbnb-base","prettier", "plugin:prettier/recommended"],
	"parser": "babel-eslint",
	"globals": {
	},

	"rules": {
		"prettier/prettier": "error",
    "strict": "off",
    "no-console": "off",
    "import/no-dynamic-require": "off",
    "global-require": "off",
    "require-yield": "off",
	},
	"plugins": ["prettier"],
}