import express from "express";
import {successMessage} from "../utils/utils";

const router = express.Router()

router.post('/list', async (req, res) => {
  res.send(successMessage(""));
});


router.post('/add', async (req, res) => {

  res.send(successMessage(""));
});


export default router;
