import { ipcMain } from 'electron'
import { Ffmpeg } from 'node-ffmpeg'
import { makeLogger } from './logger'

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