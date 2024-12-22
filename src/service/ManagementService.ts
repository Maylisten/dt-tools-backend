import {deleteFile, getFileById, getFiles} from "../dao/FilesDao";
import * as fs from "fs";
import * as path from "path";

// 获取文件列表服务
export async function listFiles(projectId: string) {
  try {
    // 从 DAO 层获取文件列表
    const files = await getFiles(projectId);
    return {status: "ok", data: files}; // 返回统一格式
  } catch (error) {
    return {status: "error"}; // 错误返回格式
  }
}

// 删除文件服务
export async function deleteFileService(projectId: string, fileId: string) {
  try {
    // 从 DAO 层移除文件并获取文件信息
    const file = await deleteFile(projectId, fileId);

    // 删除物理文件
    if (file && file.path) {
      const filePath = path.join(__dirname, "../static", file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 删除文件
      }
    }

    return {status: "ok", data: file}; // 返回删除的文件信息
  } catch (error) {
    return {status: "error"}; // 错误返回格式
  }
}

export async function getFileStream(projectId: string, fileId: string) {
  // 获取文件信息
  const file = await getFileById(projectId, fileId);

  // 拼接文件的绝对路径
  const filePath = path.join(__dirname, "../static", file.path);

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    throw new Error("文件不存在！");
  }

  // 打开文件读取流
  const stream = fs.createReadStream(filePath);
  return {stream, fileName: file.name}; // 返回文件流和文件名
}

