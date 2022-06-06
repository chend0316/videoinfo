const { ipcRenderer } = require('electron');

document.querySelector('form').addEventListener('submit', (ev) => {
  ev.preventDefault()
  const file = document.querySelector('input').files[0]
  ipcRenderer.send('video:submit', file.path)
});

ipcRenderer.on('video:metadata', (evt, duration) => {
  console.log(duration)
});

renderAppVersion();

function renderAppVersion() {
  const {app} = require('@electron/remote')
  const version = app.getVersion()
  document.querySelector('#app-version').innerHTML = version
}

