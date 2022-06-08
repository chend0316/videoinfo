const { ipcRenderer } = require('electron');

ipcRenderer.invoke('capabilities:availableEncoders').then(encoders => {
  console.log(encoders)
})
