
export interface VideoInfoRequest {
  filepath: string;
}

export interface VideoInfoResponse {
  duration: number;
}

export interface IpcRequestMap {
  [IpcKeys.get_video_info]: VideoInfoRequest,
}

export interface IpcResponseMap {
  [IpcKeys.get_video_info]: VideoInfoResponse,
}

// export type IpcKeys = keyof IpcRequestMap;
export enum IpcKeys {
  get_video_info = 'get_video_info',
}
