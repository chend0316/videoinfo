import { ipcRenderer } from 'electron';
import { IpcRequestMap, IpcResponseMap } from './schema';

type Keys = keyof IpcRequestMap;

export async function invokeIpcMethod<K extends Keys>(api: K, req: IpcRequestMap[K]): Promise<IpcResponseMap[K]> {
  return ipcRenderer.invoke(api, req);
}
