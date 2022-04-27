const { ipcRenderer } = require('electron');

document.querySelector('form').addEventListener('submit', (ev) => {
  ev.preventDefault()
  const file = document.querySelector('input').files[0]
  ipcRenderer.send('video:submit', file.path)
})
