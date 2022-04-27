const { ipcMain } = require('electron')
const ffmpeg = require('fluent-ffmpeg')
const { makeLogger } = require('./logger')

const logger = makeLogger('video')

module.exports = {
  initVideo() {
    ipcMain.on('video:submit', (event, path) => {
      ffmpeg.ffprobe(path, (err, metadata) => {
        logger.info(`Video duration is:`, metadata.format.duration)
      })
    })
  }
}