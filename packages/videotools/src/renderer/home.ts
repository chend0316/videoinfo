import { invokeIpcMethod, IpcKeys } from "electron-ipc-service";

const { ipcRenderer } = require('electron');

document.querySelector('form')!.addEventListener('submit', async (ev) => {
  ev.preventDefault()
  const file = document.querySelector('input')!.files![0]
  const resp = await invokeIpcMethod(IpcKeys.get_video_info, { filepath: file.path })
  console.log(resp.duration)
});

ipcRenderer.on('message', function (event, text) {
  var container = document.getElementById('messages')!;
  var message = document.createElement('div');
  message.innerHTML = text;
  container.appendChild(message);
})

renderAppVersion();

function renderAppVersion() {
  const { app } = require('@electron/remote')
  const version = app.getVersion()
  document.querySelector('#app-version')!.innerHTML = version
}

