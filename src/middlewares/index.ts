import cors from "cors";
import bodyParser from "body-parser";
import { Application, json } from "express";

export default (app: Application) => {
  app.use(
    cors({
      origin:process.env.FRONTEND_URL_CROS!, 
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true, 
    })
  );
  app.use(json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
};
