/**
 * Override things of the default create-react-app configuration here
 *
 * This is using react-app-rewired by @timarney
 */

const debug = require('debug')('build:config-overrides');
const webpack = require('webpack');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const fs = require('fs');
const path = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const BundleBuddyWebpackPlugin = require('bundle-buddy-webpack-plugin');

// Recursively walk a folder and get all file paths
function walkFolder(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(name => {
    // Skip dot files
    if (name.indexOf('.') === 0) return;

    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);

    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkFolder(filePath, callback);
    }
  });
}

const removeEslint = config => {
  config.module.rules = config.module.rules.filter(rule => {
    // Filter the eslint loader based on its options
    if (rule.use) {
      return rule.use.every(use => {
        if (!use.options) return true;
        return !use.options.eslintPath;
      });
    }
    return true;
  });
};

// Make sure webpack transpiles files in the shared folder
const transpileShared = config => {
  config.module.rules.forEach(rule => {
    if (!rule.oneOf) return;

    rule.oneOf.forEach(loader => {
      if (!loader.include) return;
      if (!loader.options) return;
      // The loader config we're looking for is for JS files,
      // so we look whether the config has a babelrc option
      if (!Object.keys(loader.options).includes('babelrc')) return;

      // Add the shared folder to the locations
      // that should be transpiled
      loader.include = [loader.include, path.resolve(__dirname, './shared')];
    });
  });

  return config;
};

module.exports = function override(config, env) {
  if (process.env.NODE_ENV === 'development') {
    config.output.path = path.join(__dirname, './build');
    config = rewireReactHotLoader(config, env);
    config.plugins.push(
      WriteFilePlugin({
        log: true,
        useHashIndex: false,
      })
    );
  }
  config.plugins.push(
    new ReactLoadablePlugin({
      filename: './build/react-loadable.json',
    })
  );
  config = injectBabelPlugin('react-loadable/babel', config);
  config = transpileShared(config);
  // Get all public files so they're cached by the SW
  let externals = [
    'https://www.google-analytics.com/analytics.js',
    'https://cdn.amplitude.com/libs/amplitude-4.2.1-min.gz.js',
  ];
  walkFolder('./public/', file => {
    // HOTFIX: Don't cache images
    if (file.indexOf('img') > -1 && file.indexOf('homescreen-icon') === -1)
      return;
    externals.push(file.replace(/public/, ''));
  });

  if (process.env.ANALYZE_BUNDLE === 'true') {
    debug('Bundle analyzer enabled');
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      })
    );
  }

  if (process.env.BUNDLE_BUDDY === 'true') {
    config.plugins.push(new BundleBuddyWebpackPlugin());
  }

  config.plugins.unshift(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'],
      filename: 'static/js/[name].js',
      minChunks: Infinity,
    })
  );

  if (process.env.NODE_ENV === 'production') {
    removeEslint(config);
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          SENTRY_DSN_CLIENT: `"${process.env.SENTRY_DSN_CLIENT}"`,
          AMPLITUDE_API_KEY: `"${process.env.AMPLITUDE_API_KEY}"`,
        },
      })
    );
  }
  return rewireStyledComponents(config, env, { ssr: true });
};
