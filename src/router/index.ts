import { Application } from "express";
import path from "path";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import users from "./users";
import courses from "./courses";
import upload from "./video";
import liveSession from "./liveSession";
import images from "./images";
import studenBooking from "./calender/studentBooking";
import tutorAvailability from "./calender/tutorAvailability";
import notification from "./notification";
import Blog from "./Blog"
import Groups from "./groups"
import rating from "./rating"
import messages from "./messages"
import purchases from "./purchases"

export default (app: Application) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Saber API",
        version: "1.0.0",
        description: "This page is dedicated to the route list in the application",
      },
      servers: [
        {
          url: `${process.env.API_URL || "http://localhost:5000"}/api/v1`,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT", // This tells Swagger that the token is a JWT
          },
        },
      },
      security: [{ bearerAuth: [] }], // Applies security globally to all routes
    },
    apis: [
      `${__dirname}/*${path.extname(path.basename(__filename))}`,
      `${__dirname}/*/*${path.extname(path.basename(__filename))}`,
      `${__dirname}/*/*/*${path.extname(path.basename(__filename))}`,
      `${__dirname}/*/*/*/*${path.extname(path.basename(__filename))}`,
      `${__dirname}/*/*/*/*/*${path.extname(path.basename(__filename))}`,
      `${__dirname}/*/*/*/*/*/*${path.extname(path.basename(__filename))}`,
    ],
  };

  const specs = swaggerJsDoc(options);

  app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(specs));

  app.get("/", (req, res) => {
    res.json({ message: "API Running ! " });
  });

  app.use("/api/v1/", [users,courses,upload,liveSession,images,studenBooking,tutorAvailability,notification,Blog,Groups,rating,messages,purchases]);
};
