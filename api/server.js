import { createServer } from "http";
import express from "express";
import cors from "cors";
const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
export { httpServer, app };
