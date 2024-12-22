import express from "express";
import {successMessage} from "../utils/utils";
import { addGraph ,getCurrentGraph} from "../service/DiagramService";
const router = express.Router()

router.post('/list', async (req, res) => {
  res.send(successMessage(""));
});

router.post('/get-graph',async (req,res)=>{
  const {projectId} = req.body;
  const graph= await getCurrentGraph(projectId);
  // console.log(JSON.stringify(graph));
  res.send(successMessage(graph));
})

router.post('/save-graph',(req,res)=>{
  const {graphData, projectId} = req.body; 
  addGraph(projectId,graphData);
  res.send(successMessage("hello"));
})

router.post('/get-graph',(req,res)=>{
  
})


router.post('/add', async (req, res) => {

  res.send(successMessage(""));
});


export default router;
