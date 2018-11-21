const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const match = require('micromatch');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const OfflinePlugin = require('offline-plugin');

const babelConfig = fs.readFileSync('.babelrc');
console.log(babelConfig);

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

const addOfflinePlugin = config => {
  // Filter the default serviceworker plugin, add offline plugin instead
  // Get all public files so they're cached by the SW
  let externals = [];
  walkFolder('./public/', file => {
    if (file.indexOf('index.html') > -1) return;
    externals.push(file.replace(/public/, ''));
  });
  config.plugins.push(
    new OfflinePlugin({
      // We don't want to cache anything
      caches: {},
      externals,
      autoUpdate: true,
      // NOTE(@mxstbr): Normally this is handled by setting
      // appShell: './index.html'
      // but we don't want to serve the app shell for the `/api` and `/auth` routes
      // which means we have to manually do this and filter any of those routes out
      cacheMaps: [
        {
          match: function() {
            return false;
          },
          requestTypes: ['navigate'],
        },
      ],
      rewrites: arg => arg,
      ServiceWorker: {
        entry: './public/push-sw.js',
        events: true,
        prefetchRequest: {
          mode: 'cors',
          credentials: 'include',
        },
      },
      AppCache: false,
    })
  );
};

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

module.exports = {
  babel: {
    plugins: [
      'react-loadable/babel',
      ['babel-plugin-styled-components', { ssr: true }],
    ],
  },
  webpack: {
    configure: config => {
      if (process.env.NODE_ENV === 'development') {
        config.output.path = path.join(__dirname, './build');
        config.plugins.push(
          WriteFilePlugin({
            log: true,
            useHashIndex: false,
          })
        );
      } else if (process.env.NODE_ENV === 'production') {
        addOfflinePlugin(config);
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
      config.plugins.push(
        new ReactLoadablePlugin({
          filename: './build/react-loadable.json',
        })
      );
      config = transpileShared(config);
      return config;
    },
  },
};
