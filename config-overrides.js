/**
 * Override things of the default create-react-app configuration here
 *
 * This is using react-app-rewired by @timarney
 */

const debug = require('debug')('build:config-overrides');
const webpack = require('webpack');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const swPrecachePlugin = require('sw-precache-webpack-plugin');
const fs = require('fs');
const path = require('path');
const match = require('micromatch');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const OfflinePlugin = require('offline-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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

const isServiceWorkerPlugin = plugin => plugin instanceof swPrecachePlugin;

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
  }
  config.plugins.push(
    new ReactLoadablePlugin({
      filename: './build/react-loadable.json',
    })
  );
  if (process.env.NODE_ENV === 'production') {
    removeEslint(config);
  }
  config = injectBabelPlugin('react-loadable/babel', config);
  config = transpileShared(config);
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'],
      filename: './static/js/[name].js',
      minChunks: Infinity,
    })
  );
  // Filter the default serviceworker plugin, add offline plugin instead
  config.plugins = config.plugins.filter(
    plugin => !isServiceWorkerPlugin(plugin)
  );
  // Get all public files so they're cached by the SW
  let externals = [];
  walkFolder('./public/', file => {
    // HOTFIX: Don't cache images
    if (file.indexOf('img') > -1) return;
    externals.push(file.replace(/public/, ''));
  });
  config.plugins.push(
    new OfflinePlugin({
      // Don't cache anything in dev
      caches: process.env.NODE_ENV === 'development' ? {} : 'all',
      updateStrategy: 'all', // Update all files on update, seems safer than trying to only update changed files since we didn't write the webpack config
      externals, // These files should be cached, but they're not emitted by webpack, so we gotta tell OfflinePlugin about 'em.
      excludes: ['**/*.map'], // Don't cache any source maps, they're huge and unnecessary for clients
      autoUpdate: true, // Automatically check for updates every hour
      rewrites: arg => arg,
      cacheMaps: [
        {
          match: url => {
            // Don't return the cached index.html for API requests or /auth pages
            if (url.pathname.indexOf('/api') === 0) return;
            if (url.pathname.indexOf('/auth') === 0) return;
            try {
              return new URL('/index.html', url);
              // TODO: Fix this properly instead of ignoring errors
            } catch (err) {
              return;
            }
          },
          requestType: ['navigate'],
        },
      ],
      ServiceWorker: {
        entry: './public/push-sw.js', // Add the push notification ServiceWorker
        events: true, // Emit events from the ServiceWorker
        prefetchRequest: {
          credentials: 'include', // Include credentials when fetching files, just to make sure we don't get into any issues
        },
      },
      AppCache: false, // Don't cache using AppCache, too buggy that thing
    })
  );
  if (process.env.ANALYZE_BUNDLE === 'true') {
    debug('Bundle analyzer enabled');
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      })
    );
  }
  if (process.env.NODE_ENV === 'development') {
    config.plugins.push(
      WriteFilePlugin({
        // Don't match hot-update files
        test: /^((?!(hot-update)).)*$/g,
      })
    );
  }
  return rewireStyledComponents(config, env, { ssr: true });
};
