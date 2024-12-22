import {connectDB} from "../utils/utils";
import {StoreFile} from "../types/StoreFile";

// 插入文件
export async function insertFile(projectId: string, fileId: string, filename: string, filePath: string) {
  const db = await connectDB();
  const {projects} = db.data;
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    throw new Error("项目不存在！");
  }

  project.files = project.files || [];
  const file: StoreFile = {id: fileId, path: filePath, name: filename};
  project.files.push(file);
  await db.write();
  return file; // 返回插入的文件信息
}

// 查询单个文件
export async function selectFile(projectId: string, fileId: string) {
  const db = await connectDB();
  const {projects} = db.data;

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    throw new Error("项目不存在！");
  }

  project.files = project.files || [];

  const file = project.files.find((f) => f.id === fileId);
  if (!file) {
    throw new Error("文件不存在！");
  }

  return file; // 返回文件信息
}

export async function getFiles(projectId: string) {
  const db = await connectDB();
  const {projects} = db.data;

  // 查找对应项目
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    throw new Error("项目不存在！");
  }

  // 确保 project.files 是一个数组
  project.files = project.files || [];

  // 返回项目的文件列表
  return project.files;
}

export async function deleteFile(projectId: string, fileId: string) {
  const db = await connectDB();
  const {projects} = db.data;

  // 查找对应的项目
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    throw new Error("项目不存在");
  }

  // 确保 project.files 是一个数组
  project.files = project.files || [];

  // 查找文件
  const fileIndex = project.files.findIndex((file) => file.id === fileId);
  if (fileIndex === -1) {
    throw new Error("文件不存在！");
  }

  // 从文件列表中移除文件
  const [file] = project.files.splice(fileIndex, 1);

  // 保存更改
  await db.write();
  return file;
}

// 根据文件ID获取文件信息
export async function getFileById(projectId: string, fileId: string) {
  const db = await connectDB();
  const {projects} = db.data;

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    throw new Error("项目不存在！");
  }

  project.files = project.files || [];

  const file = project.files.find((f) => f.id === fileId);
  if (!file) {
    throw new Error("文件不存在！");
  }

  return file; // 返回文件信息
}

