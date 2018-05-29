// @flow
const { app, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Setup logger
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

log.info('App starting...');

// Setup update event
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update... Please wait.');
});
autoUpdater.on('update-available', info => {
  log.info('Update available.');
  log.info('Vesrion', info.version);
  log.info('Release date', info.releaseDate);
});
autoUpdater.on('update-not-available', info => {
  log.info('Update not available.');
});
autoUpdater.on('download-progress', progress => {
  log.info(`Download progress: ${Math.floor(progress.percent)}`);
});
autoUpdater.on('update-downloaded', info => {
  log.info('Update downloaded');
});
autoUpdater.on('error', error => {
  log.info('Update error', error);
});

function updateDownloaded() {
  // Ask user to update the app
  dialog.showMessageBox(
    {
      type: 'question',
      message: 'A new version of ' + app.getName() + ' has been downloaded',
      buttons: ['Install and Relaunch', 'Later'],
      defaultId: 0,
    },
    response => {
      if (response === 1) {
        dialog.showMessageBox({
          title: 'Installing Later',
          message: 'Update will be installed when you exit the app',
        });
      } else {
        autoUpdater.quitAndInstall();
      }
    }
  );
}

function checkForUpdates() {
  autoUpdater.on('update-downloaded', updateDownloaded);

  // init for updates
  autoUpdater.checkForUpdates();
}

module.exports = checkForUpdates;
