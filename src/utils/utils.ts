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

