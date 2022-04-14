// @flow
const { app, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

module.exports = function checkForUpdates() {
  return autoUpdater.checkForUpdatesAndNotify();
};
