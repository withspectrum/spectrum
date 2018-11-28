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
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
};
