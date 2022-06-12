import * as ffmpeg from 'fluent-ffmpeg'
import { IpcKeys, registerIpcHandler } from 'electron-ipc-service'
import { makeLogger } from './logger'

const logger = makeLogger('video')

module.exports = {
  init({ mainWindow }) {
    registerIpcHandler(IpcKeys.get_video_info, (req) => {
      return new Promise((resolve, reject) => {
        const path = req.filepath
        ffmpeg.ffprobe(path, (err, metadata) => {
          if (err) {
            reject(err)
          } else {
            resolve({ duration: metadata.format.duration })
          }
        })
      })
    })
  }
}

