import express, { Application } from "express";
import { createServer } from "http";
import { config } from "dotenv";
import registerRouter from "./router";
import registerMiddlewares from "./middlewares";
import { setupSocket } from "./socket"; 


const app: Application = express();
const server = createServer(app); 

registerMiddlewares(app);
registerRouter(app);

config();
setupSocket(server);

const PORT: string | number = process.env.PORT || 5000;
const ENV: string = process.env.NODE_ENV || "development";

app.listen(PORT, () =>
  console.log(
    ` 📡 Backend server: ` + ` Running in ${ENV} mode on port ${PORT}`
  )
);
