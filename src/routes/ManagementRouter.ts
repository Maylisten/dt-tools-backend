import express from "express";
import {errorMessage, successMessage} from "../utils/utils";
import {deleteFileService, getFileStream, listFiles} from "../service/ManagementService";

const router = express.Router();

// 获取文件列表接口
router.get('/list', async (req, res) => {
    try {
        const projectId = req.query.projectId as string;
        if (!projectId) {
            throw new Error("项目ID不能为空！");
        }

        const files = await listFiles(projectId);
        res.send(successMessage(files));
    } catch (err) {
        console.error(err);
        res.send(errorMessage(err instanceof Error ? err.message : "获取文件列表失败"));
    }
});

// 删除文件接口
router.delete('/delete', async (req, res) => {
    try {
        const projectId = req.body.projectId as string;
        const fileId = req.body.fileId as string;
        if (!projectId || !fileId) {
            throw new Error("项目ID或文件ID不能为空！");
        }

        const deletedFile = await deleteFileService(projectId, fileId);
        res.send(successMessage(deletedFile));
    } catch (err) {
        console.error(err);
        res.send(errorMessage(err instanceof Error ? err.message : "删除文件失败"));
    }
});

// 文件下载接口
router.get("/download", async (req, res) => {
    try {
        const projectId = req.query.projectId as string;
        const fileId = req.query.fileId as string;

        if (!projectId || !fileId) {
            throw new Error("项目ID或文件ID不能为空！");
        }

        // 调用服务层获取文件流和文件名
        const { stream, fileName } = await getFileStream(projectId, fileId);

        // 设置响应头
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.setHeader("Content-Type", "application/octet-stream");

        // 将文件流返回给前端
        stream.pipe(res);
    } catch (error) {
        console.error("文件下载出错:", error);
        res.status(500).send({
            status: "error",
            message: error instanceof Error ? error.message : "文件下载失败",
        });
    }
});


export default router;
