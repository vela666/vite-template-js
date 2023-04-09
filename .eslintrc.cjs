/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-var': 'error',
    'no-unused-vars': 'off',
    "vue/multi-word-component-names":"off",
    // vue组件name强制使用驼峰命名
    // "vue/name-property-casing": ['error', "PascalCase"],
  },
}
