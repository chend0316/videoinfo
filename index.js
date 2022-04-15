const electron = require('electron')

const { app, BrowserWindow } = electron

app.on('ready', () => {
  console.log('app ready')
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })
  mainWindow.loadFile('./index.html')
})
