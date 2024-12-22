import express from "express";
import {errorMessage, successMessage} from "../utils/utils";
import {Model} from "../types/Model";
import {listModels, setAllModels} from "../service/RenderService";

const router = express.Router()

router.get('/list', async function (req, res) {
  try {
    const projectId = req.query.projectId as string;
    res.send(successMessage<Model[]>(await listModels(projectId)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.post('/set_all', async function (req, res) {
  try {
    const projectId = req.body.projectId as string;
    const models = req.body.models as Model[];
    res.send(successMessage(await setAllModels(projectId, models)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

export default router;
