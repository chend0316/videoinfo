const { app, ipcMain } = require('electron');
const { autoUpdater } = require("electron-updater");
const { makeLogger } = require("./logger");

const logger = makeLogger('updater')
autoUpdater.logger = logger

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

function sendStatusToWindow(text) {
  logger.info(text);
  mainWindow.webContents.send('message', text);
}

let mainWindow;

module.exports = {
  initUpdater(opts) {
    mainWindow = opts.mainWindow
    autoUpdater.checkForUpdatesAndNotify()
    sendStatusToWindow('app version' + app.getVersion())
  }
}
