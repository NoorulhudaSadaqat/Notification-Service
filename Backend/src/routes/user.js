const express = require("express");
const userRouter = express.Router();
const { bodySchemaValidator } = require("../middlewares/schemaValidator");
const { schemas } = require("../../joiSchemas/schemas");
const { signup, getUser } = require("../controllers/user");

/* prettier-ignore */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints related to user module
 */

userRouter.get("/", getUser);

module.exports = userRouter;
