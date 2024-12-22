import {DB} from "../types/DB";
import {Low} from "lowdb-js";
import {JSONFilePreset} from "lowdb-js/node";
import {Message} from "../types/Message";

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
