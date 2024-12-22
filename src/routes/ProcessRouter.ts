import express from "express";
import multer from "multer"
import {errorMessage, successMessage} from "../utils/utils";
import {beginProcesses, listProcesses} from "../service/ProcessService";
import {Process} from "../types/Process";

const router = express.Router()

// 配置 multer 存储选项
const storage = multer.memoryStorage();

// 创建 multer 实例
const upload = multer({storage});

// 上传文件接口
router.post('/upload', upload.array('files', 10), async (req, res) => {
  // 获取上传的文件
  const projectId = req.body.projectId as string;
  let steps = req.body.steps;
  if (!Array.isArray(req.body.steps)) {
    if (typeof steps === 'string') {
      steps = [steps]
    } else {
      steps = []
    }
  }
  const files = (req.files as Express.Multer.File[]).map(file => ({
    ...file, originalname: Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    )
  } as Express.Multer.File));
  await beginProcesses(projectId, files, steps)
  res.send(successMessage(files));
});

router.get('/list', async function (req, res) {
  try {
    const projectId = req.query.projectId as string;
    res.send(successMessage<Process[]>(await listProcesses(projectId)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})


export default router;
