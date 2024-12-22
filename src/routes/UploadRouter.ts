import express from "express";
import multer from "multer"
import {errorMessage, successMessage} from "../utils/utils";
import * as fs from "node:fs";
import path from "node:path";
import config from "../../config/AppConfig"

const router = express.Router()

// 配置 multer 存储选项
const storage = multer.memoryStorage();

// 创建 multer 实例
const upload = multer({storage});

// 上传文件夹
router.post('/directory', async (req, res) => {
  const basePath = req.body.basePath as string;
  const name = req.body.name as string;
  await fs.promises.mkdir(path.join(config.staticResourcePath, basePath, name), {recursive: true});
  res.send(successMessage(""));
});

// 上传文件
router.post('/file', upload.single('file'), async (req, res) => {
  const basePath = req.body.basePath as string;
  const name = req.body.name as string;
  if (!req.file) {
    res.send(errorMessage("没接收到 file"));
    return;
  }
  const file = {
    ...req.file,
    originalname: Buffer.from(req.file.originalname, "latin1").toString(
      "utf8"
    )
  } as Express.Multer.File;

  // 构建目标文件路径
  const targetDir = path.join(config.staticResourcePath, basePath);
  const targetPath = path.join(targetDir, name);
  await fs.promises.mkdir(targetDir, {recursive: true});
  await fs.promises.writeFile(targetPath, file.buffer);
  res.send(successMessage(""));
});

export default router;
