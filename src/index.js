const { app, BrowserWindow } = require('electron');
const { makeLogger } = require('./logger');
const { initUpdater } = require('./updater');
const { initVideo } = require('./video');

const logger = makeLogger('main process')

let mainWindow;
app.on('ready', () => {
  logger.info('App starting...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  mainWindow.loadFile('./src/home.html')
  mainWindow.webContents.openDevTools()
  initVideo()
  initUpdater({ mainWindow })
})
