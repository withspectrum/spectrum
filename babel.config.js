// @flow

module.exports = {
  presets: [require('./babel-preset-backpack')],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    ['babel-plugin-styled-components', { ssr: true }],
    'babel-plugin-transform-react-jsx',
    'babel-plugin-syntax-dynamic-import',
    'react-loadable/babel',
    'babel-plugin-inline-import-graphql-ast',
  ],
};
