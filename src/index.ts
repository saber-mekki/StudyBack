import express, { Application } from "express";
import { config } from "dotenv";
import registerRouter from "./router";
import registerMiddlewares from "./middlewares";

const app: Application = express();

const cors = require('cors');
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

registerMiddlewares(app);
registerRouter(app);

config();

const PORT: string | number = process.env.PORT || 5000;
const ENV: string = process.env.NODE_ENV || "development";

app.listen(PORT, () =>
  console.log(
    ` 📡 Backend server: ` + ` Running in ${ENV} mode on port ${PORT}`
  )
);
