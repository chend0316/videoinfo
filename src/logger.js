const log = require('electron-log')
log.transports.file.level = 'info';

module.exports = {
  makeLogger(prefix) {
    return {
      info(...args) {
        log.info(`[${prefix}]`, ...args)
      },
      warn(...args) {
        log.warn(`[${prefix}]`, ...args)
      },
      error(...args) {
        log.error(`[${prefix}]`, ...args)
      },
      debug(...args) {
        log.debug(`[${prefix}]`, ...args)
      }
    }
  }
}