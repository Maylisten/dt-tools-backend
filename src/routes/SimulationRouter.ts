import express from "express";
import {errorMessage, successMessage} from "../utils/utils";
import {Area, Line, Path, Point} from "../types/SimulationEntities";
import {
  addLog,
  getLogs,
  listAreas,
  listLines,
  listPaths,
  listPoints,
  setAreas,
  setLines,
  setPaths,
  setPoints
} from "../service/SimulationService";

const router = express.Router()

router.get('/point/list', async function (req, res) {
  try {
    const projectId = req.query.projectId as string;
    res.send(successMessage<Point[]>(await listPoints(projectId)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.post('/point/set', async function (req, res) {
  try {
    const projectId = req.body.projectId as string;
    const points = req.body.points as Point[];
    res.send(successMessage(await setPoints(projectId, points)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.get('/line/list', async function (req, res) {
  try {
    const projectId = req.query.projectId as string;
    res.send(successMessage<Line[]>(await listLines(projectId)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.post('/line/set', async function (req, res) {
  try {
    const projectId = req.body.projectId as string;
    const lines = req.body.lines as Line[];
    res.send(successMessage(await setLines(projectId, lines)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.get('/area/list', async function (req, res) {
  try {
    const projectId = req.query.projectId as string;
    res.send(successMessage<Area[]>(await listAreas(projectId)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.post('/area/set', async function (req, res) {
  try {
    const projectId = req.body.projectId as string;
    const areas = req.body.areas as Area[];
    res.send(successMessage(await setAreas(projectId, areas)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.get('/path/list', async function (req, res) {
  try {
    const projectId = req.query.projectId as string;
    res.send(successMessage<Path[]>(await listPaths(projectId)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.post('/path/set', async function (req, res) {
  try {
    const projectId = req.body.projectId as string;
    const paths = req.body.paths as Path[];
    res.send(successMessage(await setPaths(projectId, paths)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

// 记录渲染时间日志
router.get('/log/add', async function (req, res) {
  try {
    const projectId = req.query.projectId as string;
    const begin = parseInt(req.query.begin as string);
    const end = parseInt(req.query.end as string);
    res.send(successMessage(await addLog(projectId, begin, end)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})

router.get('/logs', async function (req, res) {
  try {
    const projectId = req.query.projectId as string;
    res.send(successMessage(await getLogs(projectId)))
  } catch (err) {
    console.error(err)
    res.send(errorMessage(err as string))
  }
})
export default router;
