import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import AppConfig from "../config/AppConfig"
import projectRouter from "./routes/ProjectRouter";
import processRouter from "./routes/ProcessRouter";
import diagramRouter from "./routes/DiagramRouter";
import uploadRouter from "./routes/UploadRouter";
import renderRouter from "./routes/RenderRouter";
import managementRouter from "./routes/ManagementRouter";
import simulationRouter from "./routes/SimulationRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(AppConfig.staticResourcePath))
app.use('/project', projectRouter);
app.use('/process', processRouter);
app.use('/management', managementRouter);
app.use('/diagram', diagramRouter);
app.use('/upload', uploadRouter);
app.use('/render', renderRouter);
app.use('/simulation', simulationRouter);

app.listen(AppConfig.port, "0.0.0.0", () => {
  console.log(`listening on port ${AppConfig.port}`)
})
