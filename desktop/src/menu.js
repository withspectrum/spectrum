// @flow
const { dialog, Menu, MenuItem, shell, clipboard } = require('electron');
const checkForUpdates = require('./autoUpdate');
const isDev = require('electron-is-dev');

const CONFIG = require('./config');

const UpdateMenuItem = new MenuItem({
  label: 'Check for updates',
  click() {
    this.enabled = false;
    checkForUpdates().then(() => {
      this.enabled = true;
    });
  },
});

/**
 * Applications menu
 **/

const template = [
  {
    label: CONFIG.APP_NAME,
    submenu: [
      {
        label: `About ${CONFIG.APP_NAME}`,
        click() {
          showAbout();
        },
      },
      { type: 'separator' },
      {
        label: 'License',
        click() {
          shell.openExternal(CONFIG.GITHUB_URL_LICENSE);
        },
      },
      UpdateMenuItem,
      { type: 'separator' },
      { role: 'hide' },
      { role: 'quit' },
    ],
  },
  {
    label: 'Go',
    submenu: [
      {
        label: 'Home',
        accelerator: 'CmdOrCtrl+Shift+H',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.loadURL(
              isDev ? CONFIG.APP_DEV_HOME_URL : CONFIG.APP_REMOTE_HOME_URL
            );
          }
        },
      },
      {
        label: 'Forward',
        accelerator: 'CmdOrCtrl+]',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            const wc = focusedWindow.webContents;
            if (wc && wc.canGoForward()) wc.goForward();
          }
        },
      },
      {
        label: 'Back',
        accelerator: 'CmdOrCtrl+[',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            const wc = focusedWindow.webContents;
            if (wc && wc.canGoBack()) wc.goBack();
          }
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          } else {
            return 'F11';
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      },
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        role: 'reload',
      },
      {
        label: 'Force Reload',
        accelerator: 'CmdOrCtrl+Shift+R',
        role: 'forceReload',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Learn More',
        click() {
          shell.openExternal(CONFIG.GITHUB_URL);
        },
      },
      {
        label: 'Contribute on GitHub',
        click() {
          shell.openExternal(CONFIG.GITHUB_URL_ISSUES);
        },
      },
    ],
  },
  {
    label: 'Share',
    submenu: [
      {
        label: 'Copy link to current page',
        click: function(item, focusedWindow) {
          const url = focusedWindow.webContents.getURL();
          if (url) {
            clipboard.writeText(url);
          }
        },
        accelerator: 'CmdOrCtrl+S',
      },
    ],
  },
];

function showAbout() {
  dialog.showMessageBox({
    title: `About ${CONFIG.APP_NAME}`,
    message: `${CONFIG.APP_NAME} ${CONFIG.APP_VERSION}`,
    detail: `The community platform for the future.`,
    buttons: [],
    icon: CONFIG.ICON,
  });
}

function createMenu() {
  const menu = Menu.buildFromTemplate(template);
  return Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
