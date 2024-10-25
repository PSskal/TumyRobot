// preload/index.js
'use strict'

const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('api', {
  connectToPort: (port, baudRate) => ipcRenderer.send('connect-to-port', port, baudRate),
  sendData: (data) => ipcRenderer.send('send-data', data),
  disconnectPort: () => ipcRenderer.send('disconnect-port') // Elimina el `null`
})
