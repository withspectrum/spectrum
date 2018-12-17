const browserify = require('@cypress/browserify-preprocessor');

module.exports = (on, config) => {
  const options = browserify.defaultOptions;
  options.browserifyOptions.transform[1][1].presets.push('@babel/preset-flow');
  on('file:preprocessor', browserify(options));
};
