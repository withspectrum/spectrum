/**
 * Override things of the default create-react-app configuration here
 *
 * This is using react-app-rewired by @timarney
 */

const rewireStyledComponents = require('react-app-rewire-styled-components');
const swPrecachePlugin = require('sw-precache-webpack-plugin');
const isServiceWorkerPlugin = plugin => plugin instanceof swPrecachePlugin;
const whitelist = path => new RegExp(`^(?!\/${path}).*`);
// Don't cache server routes with the ServiceWorker
const setCustomSwPrecacheOptions = config => {
  if (process.env.NODE_ENV !== 'production') return;
  const swPlugin = config.plugins.find(isServiceWorkerPlugin);
  // Add all /api and /auth routes to the whitelist to not be cached by the ServiceWorker
  swPlugin.options.navigateFallbackWhitelist = [whitelist('(api|auth|__)')];
  const { importScripts = [] } = swPlugin.options;
  // Import our push ServiceWorker
  swPlugin.options.importScripts = [...importScripts, 'push-sw.js'];
};

module.exports = function override(config, env) {
  setCustomSwPrecacheOptions(config);
  return rewireStyledComponents(config, env);
};
