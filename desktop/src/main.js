// @flow
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

const checkForUpdates = require('./autoUpdate');
const buildMenu = require('./menu');
const CONFIG = require('./config');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// eslint-disable-next-line
let win;
let splash;
let mainWindow;

const startUrl = isDev ? CONFIG.APP_DEV_URL : CONFIG.APP_REMOTE_URL;

function createWindow() {
  if (!isDev) {
    // trigger autoupdate check
    checkForUpdates();
  }

  // create a `splash` window
  splash = new BrowserWindow({
    width: 768,
    height: 408,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  splash.loadURL(`file://${__dirname}/splash.html`);

  // Create the main browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1300,
    minHeight: CONFIG.WINDOW_MIN_HEIGHT,
    minWidth: CONFIG.WINDOW_MIN_WIDTH,
    backgroundColor: CONFIG.WINDOW_BG_COLOR,
    /**
     * Disable Electron's Node integration to prevent untrusted client
     * code from having access to the process and file system:
     *  - https://github.com/atom/electron/issues/254
     *  - https://github.com/atom/electron/issues/1753
     */
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
    show: false,
  });

  // Load Remote Url
  mainWindow.loadURL(startUrl);

  // Build application menu
  buildMenu();

  mainWindow.on('closed', () => {
    win = null;
  });

  // if main window is ready to show, then destroy the splash window and show up the main window
  mainWindow.once('ready-to-show', () => {
    splash.destroy();
    mainWindow.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
