module.exports = {
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['eslint-plugin-flowtype'],
  rules: {
    'no-undef': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 0,
    'no-empty': 0,
    'no-useless-escape': 1,
    'no-fallthrough': 1,
    'no-extra-boolean-cast': 1,
  },
};
