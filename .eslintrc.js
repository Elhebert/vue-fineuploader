module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ['plugin:vue/recommended', '@vue/prettier'],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
  },

  parserOptions: {
    parser: 'babel-eslint',
  },
}
