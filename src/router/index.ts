import { Application } from "express";
import path from "path";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import users from "./users";
import courses from "./courses";

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
          url: "http://localhost:" + process.env.PORT + "/api/v1",
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

  app.use("/api/v1/", [users,courses]);
};
