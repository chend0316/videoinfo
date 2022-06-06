const { ipcMain } = require('electron')
const { Ffmpeg } = require('node-ffmpeg')
const { makeLogger } = require('./logger')

const logger = makeLogger('capabilities')

module.exports = {
  init() {
    ipcMain.handle('capabilities:availableEncoders', async (event) => {
      const encoders = await new Ffmpeg().availableEncoders()
      logger.info(encoders)
      return encoders
    })
  }
}