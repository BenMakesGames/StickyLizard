import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/ipc'

const api = {
  saveGame: (json: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.SAVE_GAME, json),
  loadGame: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.LOAD_GAME)
}

contextBridge.exposeInMainWorld('api', api)
