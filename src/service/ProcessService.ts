import {Step} from "../types/Process";
import {v1 as uuid} from "uuid";
import {insertProcess, selectProcesses, updateProcessStatus} from "../dao/ProcessesDao";
import config from "../../config/AppConfig"
import * as fs from "node:fs";
import {insertFile} from "../dao/FilesDao";
import path from "node:path";
import {getDataTypeProcessorStrategies} from "../utils/process";
import {withMinRandomWait} from "../utils/utils";

const {staticResourcePath} = config;

export async function beginProcesses(projectId: string, files: Express.Multer.File[], steps: Step[]) {
  files.forEach(file => beginProcess(projectId, file, steps))
}

async function beginProcess(projectId: string, file: Express.Multer.File, steps: Step[]) {
  // 初始化进度
  const fileId = uuid()
  const process = await insertProcess(projectId, fileId, file.originalname, steps)

  // 处理文件
  let newFile = file;
  for (const [index, step] of steps.entries()) {
    await updateProcessStatus(projectId, process.id, index)
    newFile = await withMinRandomWait(getDataTypeProcessorStrategies(newFile)[step](newFile), 3000, 5000)
  }

  // 存储处理后的文件
  const {filename, filePath} = await dataStore(newFile)
  await insertFile(projectId, fileId, filename, filePath);

  // 表示全部完成
  await updateProcessStatus(projectId, process.id, steps.length)
}

/**
 * 数据存储
 * @param file
 */
async function dataStore(file: Express.Multer.File) {
  // 创建一个唯一的文件名，避免文件名冲突
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.originalname}`;
  // 目标路径
  const filePath = path.join(staticResourcePath, filename);

  // 使用 fs 将文件从内存存储到磁盘
  return new Promise<{ filename: string, filePath: string }>((resolve, reject) => {
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        reject('文件存储失败');
      } else {
        resolve({filename: filename, filePath: `/${filename}`});
      }
    });
  });
}


export async function listProcesses(projectId: string) {
  return selectProcesses(projectId)
}
