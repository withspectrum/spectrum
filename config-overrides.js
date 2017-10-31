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

const isServiceWorkerPlugin = plugin => plugin instanceof swPrecachePlugin;
const whitelist = path => new RegExp(`^(?!\/${path}).*`);
// Don't cache server routes with the ServiceWorker
const setCustomSwPrecacheOptions = config => {
  if (process.env.NODE_ENV !== 'production') return;
  const swPlugin = config.plugins.find(isServiceWorkerPlugin);
  // Add all /api and /auth routes to the whitelist to not be cached by the ServiceWorker
  swPlugin.options.navigateFallbackWhitelist = [whitelist('(api|auth|__)')];
  const { importScripts = [] } = swPlugin.options;
  // Get the push-sw filename
  const publicFiles = fs.readdirSync('./public');
  const matchingFiles = match(publicFiles, ['push-sw-*.js']);
  if (!matchingFiles || matchingFiles.length < 1)
    throw new Error('push-sw.js file not found in public folder.');
  // Import our push ServiceWorker
  swPlugin.options.importScripts = [...importScripts, matchingFiles[0]];
};

module.exports = function override(config, env) {
  setCustomSwPrecacheOptions(config);
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
  config = injectBabelPlugin('react-loadable/babel', config);
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'],
      filename: './static/js/[name].js',
      minChunks: Infinity,
    })
  );
  return rewireStyledComponents(config, env, { ssr: true });
};
