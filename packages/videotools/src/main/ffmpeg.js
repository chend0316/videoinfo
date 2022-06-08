const { ipcMain } = require('electron')
const ffmpeg = require('fluent-ffmpeg')
const { makeLogger } = require('./logger')

const logger = makeLogger('video')

module.exports = {
  init({ mainWindow }) {
    ipcMain.on('video:submit', (event, path) => {
      ffmpeg.ffprobe(path, (err, metadata) => {
        logger.info(`Video duration is:`, metadata.format.duration)
        mainWindow.webContents.send(
          'video:metadata',
          metadata.format.duration
        )
      })
    })
  }
}
