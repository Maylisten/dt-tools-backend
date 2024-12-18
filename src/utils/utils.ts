import {DB} from "../types";
import {Low} from "lowdb-js";
import {JSONFilePreset} from "lowdb-js/node";

let db: Low<DB>;

export async function connectDB() {
  if (!db) {
    const defaultDb: DB = {projects: [{name: "test"}]}
    db = await JSONFilePreset('database/db.json', defaultDb);
  }
  return db;
}
