// main/index.js
'use strict'
const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const utils = require('@electron-toolkit/utils')
const icon = path.join(__dirname, '../../resources/icon.png')
const { SerialPort } = require('serialport')

let connectPort = null

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (utils.is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  return mainWindow
}

// Handler para conectarse al puerto serial
ipcMain.on('connect-to-port', (event, portName, baudRate) => {
  if (connectPort) {
    connectPort.close((err) => {
      if (err) {
        console.error('Error al cerrar el puerto:', err.message)
      }
    })
  }

  connectPort = new SerialPort({ path: portName, baudRate: parseInt(baudRate) }, (err) => {
    if (err) {
      console.error('Error al conectar al puerto:', err.message)
      event.reply('connect-port-error', err.message)
      return
    }
    console.log(`Conectado al puerto ${portName} con baudRate ${baudRate} nuevo`)
    event.reply('connect-port-success') // Notificar éxito al renderer
  })

  connectPort.on('open', () => {
    console.log('Puerto serial abierto')
    // Cerrar el puerto después de un tiempo (por ejemplo, 5 segundos)
    setTimeout(() => {
      console.log('Cerrando el puerto serial...')
      connectPort.close((err) => {
        if (err) {
          return console.error('Error al cerrar el puerto:', err.message)
        }
        console.log('Puerto cerrado')
      })
    }, 10000) // Cambia el tiempo (en milisegundos) según sea necesario
  })

  connectPort.on('error', (err) => {
    console.error('Error en el puerto:', err.message)
    event.reply('connect-port-error', err.message)
  })

  connectPort.on('close', () => {
    console.log(`El puerto ${portName} se ha cerrado.`)
    connectPort = null
  })
})

// Handler para enviar datos al puerto serial
ipcMain.on('send-data', (event, data) => {
  if (connectPort && connectPort.isOpen) {
    connectPort.write(data + '\n', (err) => {
      if (err) {
        console.error('Error al enviar datos:', err.message)
        event.reply('send-data-error', err.message)
      } else {
        console.log('Datos enviados:', data)
        event.reply('send-data-success') // Notificar éxito al renderer
      }
    })
  } else {
    const errorMessage = 'No hay ningún puerto conectado o el puerto no está abierto.'
    console.error(errorMessage)
    event.reply('send-data-error', errorMessage)
  }
})

// Handler para desconectar el puerto serial
ipcMain.on('disconnect-port', (event) => {
  if (connectPort) {
    connectPort.close((err) => {
      if (err) {
        console.error('Error al cerrar el puerto:', err.message)
        event.reply('disconnect-port-error', err.message)
      } else {
        console.log('Puerto cerrado correctamente.')
        connectPort = null
        event.reply('disconnect-port-success') // Notificar éxito al renderer
      }
    })
  } else {
    const errorMessage = 'No hay ningún puerto conectado.'
    console.warn(errorMessage)
    event.reply('disconnect-port-error', errorMessage)
  }
})

// Inicialización de la aplicación cuando esté lista
app.whenReady().then(() => {
  createWindow()

  // En macOS, recrear la ventana si todas están cerradas
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Cerrar la aplicación cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
