/**
 * Override things of the default create-react-app configuration here
 *
 * This is using react-app-rewired by @timarney
 */

const { injectBabelPlugin } = require('react-app-rewired');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const swPrecachePlugin = require('sw-precache-webpack-plugin');
const fs = require('fs');
const match = require('micromatch');
const WriteFilePlugin = require('write-file-webpack-plugin');

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
  config = injectBabelPlugin(
    [
      'import-inspector',
      {
        serverSideRequirePath: true,
        webpackRequireWeakId: true,
      },
    ],
    config
  );
  return rewireStyledComponents(config, env, { ssr: true });
};
