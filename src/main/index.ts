import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { is } from '@electron-toolkit/utils'
import { IPC_CHANNELS } from '../shared/ipc'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC Handlers
ipcMain.handle(IPC_CHANNELS.SAVE_GAME, async (_event, json: string): Promise<boolean> => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Game',
    defaultPath: 'setae-save.json',
    filters: [{ name: 'Setae Save', extensions: ['json'] }]
  })

  if (canceled || !filePath) return false

  await writeFile(filePath, json, 'utf-8')
  return true
})

ipcMain.handle(IPC_CHANNELS.LOAD_GAME, async (): Promise<string | null> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Load Game',
    filters: [{ name: 'Setae Save', extensions: ['json'] }],
    properties: ['openFile']
  })

  if (canceled || filePaths.length === 0) return null

  const data = await readFile(filePaths[0], 'utf-8')
  return data
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
