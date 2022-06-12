import { ipcMain } from 'electron';
import { IpcKeys, IpcRequestMap, IpcResponseMap } from './schema';

export function registerIpcHandler<K extends IpcKeys>(key: K, handler: (req: IpcRequestMap[K]) => Promise<IpcResponseMap[K]>) {
  ipcMain.handle(key, async (event, req) => {
    return await handler(req);
  })
}
