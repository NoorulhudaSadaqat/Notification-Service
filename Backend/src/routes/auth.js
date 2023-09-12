const express = require("express");
const authRouter = express.Router();
const { bodySchemaValidator } = require("../middlewares/schemaValidator");
const { schemas } = require("../../joiSchemas/schemas");
const { login, signup } = require("../controllers/auth");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints related to auth module
 */

/**
 * @swagger
 * /auth/:
 *   post:
 *     description: Create a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: John
 *               lastName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: johnexample.com
 *               password:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: password123
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjRhM2EwZjEzNTU1NjAwMjA0MzE3ZGUiLCJpYXQiOjE2MzE4ODc0MzYsImV4cCI6MTYzMTkwNDAzNn0.n8JzHReY0EX4i-YDXB5GdL8pFla6Mv6uE9u6MqhAGiU"
 *       400:
 *         description: Invalid credentials or bad request
 */

authRouter.post("/signup", bodySchemaValidator(schemas.user), signup);

/**
 * @swagger
 * /auth/:
 *   post:
 *     description: Authenticate user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: password123
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjRhM2EwZjEzNTU1NjAwMjA0MzE3ZGUiLCJpYXQiOjE2MzE4ODc0MzYsImV4cCI6MTYzMTkwNDAzNn0.n8JzHReY0EX4i-YDXB5GdL8pFla6Mv6uE9u6MqhAGiU"
 *       400:
 *         description: Invalid credentials or bad request
 */

authRouter.post("/login", bodySchemaValidator(schemas.auth), login);

module.exports = authRouter;
