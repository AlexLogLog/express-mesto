module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "airbnb-base",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "no-console": "off",
        "no-underscore-dangle": [
          "error",
          {
            "allow": [
              "_id"
            ]
          }
        ],
        "no-control-regex": 0,
        "no-useless-escape": 0,
        "func-names": [
          "error",
          "never"
        ]
      }
};
