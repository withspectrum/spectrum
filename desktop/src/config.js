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

  GITHUB_URL: 'https://github.com/withspectrum/spectrum',
  GITHUB_URL_LICENSE:
    'https://github.com/withspectrum/spectrum/blob/alpha/LICENSE',
  GITHUB_URL_ISSUES: 'https://github.com/withspectrum/spectrum/issues',

  WINDOW_MIN_HEIGHT: 500,
  WINDOW_MIN_WIDTH: 770,
  WINDOW_BG_COLOR: '#F5F8FC',

  ICON: resolve(__dirname, '../resources/icons/png/icon-512x512.png'),
};
