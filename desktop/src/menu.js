const electron = require('electron');

const CONFIG = require('./config');

/**
 * Applications menu
 **/

const { app, Menu, shell } = electron;
const appVersion = app.getVersion();
const name = 'Spectrum';

const template = [
  {
    label: name,
    submenu: [
      { label: `${CONFIG.APP_NAME} v ${CONFIG.APP_VERSION}` },
      { type: 'separator' },
      {
        label: 'License',
        click() {
          shell.openExternal(CONFIG.GITHUB_URL_LICENSE);
        },
      },
      { type: 'separator' },
      { role: 'quit' },
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
];

function createMenu() {
  const menu = Menu.buildFromTemplate(template);
  return Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
