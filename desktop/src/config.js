const { app } = require('electron');
/**
 * Applications Configuration
 **/

module.exports = {
  APP_NAME: 'Spectrum',
  APP_VERSION: app.getVersion(),
  APP_REMOTE_URL: 'https://spectrum.chat/',
  APP_DEV_URL: 'http://localhost:3000',

  GITHUB_URL: 'https://github.com/withspectrum/spectrum',
  GITHUB_URL_LICENSE:
    'https://github.com/withspectrum/spectrum/blob/alpha/LICENSE',
  GITHUB_URL_ISSUES: 'https://github.com/withspectrum/spectrum/issues',

  WINDOW_MIN_HEIGHT: 768,
  WINDOW_MIN_WIDTH: 425,
  WINDOW_BG_COLOR: '#FFFFFF',
};
