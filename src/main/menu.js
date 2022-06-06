const { app, Menu, dialog } = require('electron')
const { i18n } = require('./i18n')

const isMac = process.platform === 'darwin'

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      {
        label: i18n('open-file'),
        click: openFile
      }
    ]
  },
  {
    label: 'Dev',
    submenu: [
      { label: 'Relaunch', click: relaunch, accelerator: 'CommandOrControl+Shift+R' },
    ]
  }
]

function init() {
  const mainMenu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(mainMenu)
}

async function openFile() {
  const files = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections']
  })
  console.log(files)
}

async function relaunch() {
  app.relaunch()
  app.quit()
}

module.exports = {
  init
}
