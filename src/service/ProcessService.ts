import {Step} from "../types/Process";
import {v1 as uuid} from "uuid";
import {insertProcess, selectProcesses, updateProcessStatus} from "../dao/ProcessesDao";
import {randomWait} from "../utils/utils";
import config from "../../config/AppConfig"
import * as fs from "node:fs";
import {insertFile} from "../dao/FilesDao";
import path from "node:path";

const {staticResourcePath} = config;
// 随机等待的时间（模拟）
const minWaitTime = 3000
const maxWaitTime = 6000

export async function beginProcesses(projectId: string, files: Express.Multer.File[], steps: Step[]) {
  files.forEach(file => beginProcess(projectId, file, steps))
}

async function beginProcess(projectId: string, file: Express.Multer.File, steps: Step[]) {
  const strategies = {
    [Step.DataCleaning]: dataCleaning,
    [Step.DataTransformation]: dataTransformation,
    [Step.DataCompression]: dataCompression,
    [Step.DataEncryption]: dataEncryption,
  }
  // 初始化进度
  const fileId = uuid()
  const process = await insertProcess(projectId, fileId, file.originalname, steps)

  // 处理文件
  let newFile = file;
  for (const [index, step] of steps.entries()) {
    await updateProcessStatus(projectId, process.id, index)
    newFile = await strategies[step](newFile)
  }

  // 存储处理后的文件
  const {filename, filePath} = await dataStore(newFile)
  await insertFile(projectId, fileId, filename, filePath);

  // 表示全部完成
  await updateProcessStatus(projectId, process.id, steps.length)
}


/**
 * 数据清洗
 * @param file
 */
async function dataCleaning(file: Express.Multer.File) {
  // 随机等待
  await randomWait(minWaitTime, maxWaitTime)
  return file;
}

/**
 * 数据转换
 * @param file
 */
async function dataTransformation(file: Express.Multer.File) {
  await randomWait(minWaitTime, maxWaitTime)
  return file;
}

/**
 * 数据压缩
 * @param file
 */
async function dataCompression(file: Express.Multer.File) {
  await randomWait(minWaitTime, maxWaitTime)
  return file;
}

/**
 * 数据加密
 * @param file
 */
async function dataEncryption(file: Express.Multer.File) {
  await randomWait(minWaitTime, maxWaitTime)
  return file;
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
        resolve({filename: file.originalname, filePath: `/${filename}`});
      }
    });
  });
}


export async function listProcesses(projectId: string) {
  return selectProcesses(projectId)
}
