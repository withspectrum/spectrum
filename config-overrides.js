/**
 * Override things of the default create-react-app configuration here
 *
 * This is using react-app-rewired by @timarney
 */

const rewireStyledComponents = require('react-app-rewire-styled-components');
const swPrecachePlugin = require('sw-precache-webpack-plugin');
const fs = require('fs');
const match = require('micromatch');
const webpack = require('webpack');

// Get hash of latest commit
const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

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

  // Add __COMMIT_HASH__ env variable to be able to track releases in Sentry
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.COMMIT_HASH': JSON.stringify(commitHash),
    })
  );
  return rewireStyledComponents(config, env);
};
