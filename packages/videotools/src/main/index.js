const { app, BrowserWindow, Menu } = require('electron');
const { makeLogger } = require('./logger');
const { initUpdater } = require('./updater');

const path = require('path');
const ffmpeg = require('./ffmpeg');
const menu = require('./menu');
const capabilities = require('./capabilities');

const logger = makeLogger('main process');

const menuTemplate = [
  // {},
  {
    label: 'File',
  },
];

let mainWindow;
app.on('ready', () => {
  logger.info('App starting...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, '../renderer/preload.js'),
    },
  });
  mainWindow.loadFile('./dist/renderer/home.html');
  mainWindow.webContents.openDevTools();
  ffmpeg.init({ mainWindow });
  // initUpdater({ mainWindow })
  // menu.init()
  require('@electron/remote/main').initialize();
  require('@electron/remote/main').enable(mainWindow.webContents);
  capabilities.init();
});
