import {connectDB} from "../utils/utils";
import {StoreFile} from "../types/StoreFile";

export async function insertFile(projectId: string, fileId: string, filename: string, filePath: string) {
  const db = await connectDB();
  const {projects} = db.data
  const project = projects.find(p => p.id === projectId)!;
  project.files = project.files || [];
  const file: StoreFile = {id: fileId, path: filePath, name: filename}
  project.files.push(file);
  await db.write();
  return process;
}

export async function selectFile(projectId: string, fileId: string) {

}

