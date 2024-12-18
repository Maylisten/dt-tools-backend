import express from "express";
import {errorMessage, successMessage} from "../utils/utils";
import {Project} from "../types/Project";
import {addProject, listProjects} from "../service/ProjectService";

const router = express.Router()

router.get('/list', async function (req, res) {
  try {
    res.send(successMessage<Project[]>(await listProjects()))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.post('/add', async function (req, res) {
  try {
    const name = req.body.name as string;
    res.send(successMessage<Project>(await addProject(name)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

export default router;
