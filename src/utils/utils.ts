import {DB} from "../types/DB";
import {Low} from "lowdb-js";
import {JSONFilePreset} from "lowdb-js/node";
import {Message} from "../types/Message";
import {PassThrough, Readable} from "node:stream";
import crypto from "crypto";
import config from "../../config/AppConfig"
import compressing from "compressing"
import pump from "pump"

const key = config.AES_KEY
const iv = config.IV

let db: Low<DB>;

export async function connectDB() {
  if (!db) {
    const defaultDb: DB = {projects: []}
    db = await JSONFilePreset('database/db.json', defaultDb);
  }
  return db;
}

export function successMessage<T>(data: T): Message<T> {
  return {status: 'ok', data}
}

export function errorMessage(err: string): Message<null> {
  return {status: 'error', data: null, message: err}
}

/**
 * 随机等到 minTime 到 maxTime 毫秒
 * @param minTime
 * @param maxTime
 */
export function randomWait(minTime: number, maxTime: number): Promise<void> {
  // 生成一个在 minTime 和 maxTime 之间的随机时间（单位：毫秒）
  const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

  // 返回一个 Promise，在随机时间后解析
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, randomTime);
  });
}

/**
 * 递归地将对象中的所有日期字符串转换为 Date 对象
 * @param obj - 输入对象
 * @returns 转换后的对象
 */
export function parseDatesInObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj; // 如果不是对象或数组，直接返回
  }

  if (Array.isArray(obj)) {
    return obj.map(item => parseDatesInObject(item)) as T; // 如果是数组，递归处理每个元素
  }

  const parsedObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      // 如果是日期字符串，转换为 Date 对象
      parsedObj[key] = new Date(value);
    } else if (typeof value === 'object') {
      // 如果是对象，递归处理
      parsedObj[key] = parseDatesInObject(value);
    } else {
      // 其他类型直接赋值
      parsedObj[key] = value;
    }
  }

  return parsedObj as T;
}

export function addFileTag(filename: string, tag: string): string {
  const extensionIndex = filename.lastIndexOf('.');
  if (extensionIndex === -1) {
    // 如果没有扩展名，直接返回原始文件名
    return filename + '.' + tag;
  }

  // 获取文件名和扩展名
  const name = filename.slice(0, extensionIndex);
  const extension = filename.slice(extensionIndex);

  // 将标记添加到文件名中
  return `${name}.${tag}${extension}`;
}

export function replaceFileExtension(filename: string, newExtension: string): string {
  const extensionIndex = filename.lastIndexOf('.');

  // 如果没有扩展名，直接添加新扩展名
  if (extensionIndex === -1) {
    return `${filename}.${newExtension}`;
  }

  // 替换原有扩展名为新的扩展名
  const name = filename.slice(0, extensionIndex);
  return `${name}.${newExtension}`;
}


export async function withMinRandomWait<T>(promise: Promise<T>, minMillisecond: number, maxMillisecond: number): Promise<T> {
  const promises = [promise, await randomWait(minMillisecond, maxMillisecond)] as const;
  const results = await Promise.all(promises)
  return results[0]
}


// export async function gzipBuffer(inputBuffer: Buffer): Promise<Buffer> {
//   return new Promise((resolve, reject) => {
//     const gzip = zlib.createGzip();  // 创建 Gzip 压缩流
//     const chunks: Buffer[] = [];
//     const outputStream = new PassThrough();
//     outputStream.on('data', chunk => chunks.push(chunk));
//     outputStream.on('end', () => resolve(Buffer.concat(chunks)));
//     outputStream.on('error', reject);
//     const inputStream = Readable.from(inputBuffer); // 将 Buffer 转成 Readable 流
//     inputStream.pipe(gzip).pipe(outputStream);
//   });
// }


export async function gzipBuffer(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const sourceStream = Readable.from(inputBuffer);
    const gzipStream = new compressing.gzip.FileStream();
    const chunks: Buffer[] = [];
    const outputStream = new PassThrough();
    outputStream.on('data', chunk => chunks.push(chunk));
    outputStream.on('end', () => resolve(Buffer.concat(chunks)));
    outputStream.on('error', reject);
    pump(sourceStream, gzipStream, outputStream);
  });
}

// 加密
export function encrypt(str: string) {
  try {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
  } catch (err) {
    throw err;
  }
}

export function decrypt(str: string) {
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
  } catch (err) {
    console.log('解密失败');
    throw err;
  }
}
