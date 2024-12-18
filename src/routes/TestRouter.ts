import express from "express";
import * as projectService from "../service/ProjectService";

const router = express.Router()

router.get('/test', async function (req, res) {
  res.send(await projectService.listProjects())
})

export default router;
