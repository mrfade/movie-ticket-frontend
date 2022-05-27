module.exports = {
  root: true,
  // parser: "@babel/eslint-parser",
  // parserOptions: {
  //   "sourceType": "module"
  // },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    './.nuxt/.eslintrc.js'
  ],
  plugins: ['vue'],
  globals: {
    definePageMeta: 'readonly'
  },
  env: {
    'vue/setup-compiler-macros': true
  },
  rules: {
    semi: [2, 'never'],
    quotes: [2, 'single', 'avoid-escape'],
    curly: ['error', 'multi', 'consistent'],
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off',
    'vue/singleline-html-element-content-newline': 'off'
  }
}
