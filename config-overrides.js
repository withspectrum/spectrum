/**
 * Override things of the default create-react-app configuration here
 *
 * This is using react-app-rewired by @timarney
 */

const webpack = require('webpack');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const swPrecachePlugin = require('sw-precache-webpack-plugin');
const fs = require('fs');
const match = require('micromatch');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ManifestPlugin = require('webpack-module-manifest-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const OfflinePlugin = require('offline-plugin');

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

module.exports = function override(config, env) {
  config.plugins.push(WriteFilePlugin());
  config.plugins.push(
    new ManifestPlugin({
      filename: './build/client.manifest.json',
    })
  );
  config.plugins.push(
    new ReactLoadablePlugin({
      filename: './build/react-loadable.json',
    })
  );
  if (process.env.NODE_ENV === 'production') {
    removeEslint(config);
  }
  config = injectBabelPlugin('react-loadable/babel', config);
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
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new OfflinePlugin({
        caches: 'all',
        updateStrategy: 'all', // Update all files on update, seems safer than trying to only update changed files since we didn't write the webpack config
        externals: ['install-raven.js'], // These files should be cached, but they're not emitted by webpack, so we gotta tell OfflinePlugin about 'em. TODO: Figure out if we need to include images etc here
        excludes: ['**/*.map'], // Don't cache any source maps, they're huge and unnecessary for clients
        autoUpdate: true, // Automatically check for updates every hour
        cacheMaps: [
          {
            match: url => {
              // Don't return the cached index.html for API requests or /auth pages
              if (url.pathname.indexOf('/api') === 0) return;
              if (url.pathname.indexOf('/auth') === 0) return;
              return new URL(url);
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
  }
  return rewireStyledComponents(config, env, { ssr: true });
};
