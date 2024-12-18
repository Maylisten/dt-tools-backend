import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import AppConfig from "../config/AppConfig"
import testRouter from "./routes/TestRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(AppConfig.staticResourcePath))

app.use('/test', testRouter);

app.listen(AppConfig.port, "0.0.0.0", () => {
  console.log(`listening on port ${AppConfig.port}`)
})
