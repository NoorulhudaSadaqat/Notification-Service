const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { schemas } = require("../joiSchemas/schemas");
const debug = require("debug")("notificationApp");

// debug("schema : ", schemas.message.describe());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Notification micro service",
      version: "1.0.0",
      description: "API documentation for notifcation micro service",
    },
    basePath: "api/v1",
    components: {
      responses: {
        noTokenProvided: {
          description: "Access token not provided",
        },
        BadRequestOrInvalidToken: {
          description: "Bad request or invalid token provided",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
