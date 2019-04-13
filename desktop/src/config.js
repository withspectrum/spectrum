// @flow
const { app } = require('electron');
const { resolve } = require('path');

/**
 * Applications Configuration
 **/

module.exports = {
  APP_NAME: 'Spectrum',
  APP_VERSION: app.getVersion(),
  APP_REMOTE_URL: 'https://spectrum.chat/login',
  APP_DEV_URL: 'http://localhost:3000/login',
  APP_REMOTE_HOME_URL: 'https://spectrum.chat',
  APP_DEV_HOME_URL: 'http://localhost:3000',

  GITHUB_URL: 'https://github.com/withspectrum/spectrum',
  GITHUB_URL_LICENSE:
    'https://github.com/withspectrum/spectrum/blob/alpha/LICENSE',
  GITHUB_URL_ISSUES: 'https://github.com/withspectrum/spectrum/issues',

  WINDOW_DEFAULT_HEIGHT: 800,
  WINDOW_DEFAULT_WIDTH: 1300,
  WINDOW_MIN_HEIGHT: 500,
  WINDOW_MIN_WIDTH: 320,
  WINDOW_BG_COLOR: '#FAFAFA',

  ICON: resolve(__dirname, '../resources/icons/png/icon-512x512.png'),
};
