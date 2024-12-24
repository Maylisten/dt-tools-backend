export type Process = {
  id: string,
  fileId: string,
  filename: string,
  steps: Step[],
  status: number // 表示当前正在执行第 n 步
}

export enum Step {
  DataClean = 'DataClean',
  DataCompression = 'DataCompression',
  DataEncryption = 'DataEncryption',
  DataDecryption = 'DataDecryption',
  DataSample = "DataSample"
}
