const express = require("express");
const messageRouter = express.Router();
const {
  bodySchemaValidator,
  querySchemaValidator,
} = require("../middlewares/schemaValidator");
const {
  schemas,
  querySchemas,
  patchSchemas,
} = require("../../joiSchemas/schemas");

const {
  createMessage,
  getMessage,
  getAllMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/message");

/* prettier-ignore */

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API endpoints related to message module
 */

/**
 * @swagger
 * /messages/:
 *   post:
 *     description: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: ID of the application associated with the message
 *               eventId:
 *                 type: string
 *                 description: ID of the event associated with the message
 *               notifcationTypeId:
 *                 type: string
 *                 description: ID of the notification type associated with the message
 *               isActive:
 *                 type: boolean
 *                 description: Indicates whether the message is active or not
 *               createdBy:
 *                 type: string
 *                 description: ID of the user who created the message
 *               createdDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the message was created
 *               modifiedBy:
 *                 type: string
 *                 description: ID of the user who last modified the message
 *               modifiedDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the message was last modified
 *             required:
 *               - applicationId
 *               - eventId
 *               - notifcationTypeId
 *     responses:
 *       200:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 applicationId:
 *                   type: string
 *                   example: "app123"
 *                 eventId:
 *                   type: string
 *                   example: "event123"
 *                 notifcationTypeId:
 *                   type: string
 *                   example: "notificationType123"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdBy:
 *                   type: string
 *                   example: "user123"
 *                 createdDate:
 *                   type: string
 *                   format: date
 *                   example: "2023-07-24"
 *                 modifiedBy:
 *                   type: string
 *                   example: "user123"
 *                 modifiedDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *       400:
 *         description: Bad request, invalid data received
 */

messageRouter.post("/", bodySchemaValidator(schemas.message), createMessage);

/* prettier-ignore */

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     description: Get a single message by ID
 *     tags: [Messages]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the message to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12"
 *                 name:
 *                   type: string
 *                   example: "Sample Message"
 *                 content:
 *                   type: string
 *                   example: "This is a sample message content."
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdBy:
 *                   type: string
 *                   example: "user123"
 *                 createdDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *                 modifiedBy:
 *                   type: string
 *                   example: "user123"
 *                 modifiedDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *       400:
 *         description: Bad request, invalid ID format
 *       404:
 *         description: Message with the given ID not found
 */

messageRouter.get("/:id", getMessage);

/* prettier-ignore */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     description: Fetches all messages
 *     tags: [Messages]
 *     parameters:
 *       - name: applicationId
 *         in: query
 *         schema:
 *           type: string
 *       - name: eventId
 *         in: query
 *         schema:
 *           type: string
 *       - name: notifcationTypeId
 *         in: query
 *         schema:
 *           type: string
 *       - name: isActive
 *         in: query
 *         schema:
 *           type: string
 *       - name: createdBy
 *         in: query
 *         schema:
 *           type: string
 *       - name: createdDate
 *         in: query
 *         schema:
 *           type: string
 *       - name: modifiedBy
 *         in: query
 *         schema:
 *           type: string
 *       - name: modifiedDate
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages have been fetched successfully
 *       204:
 *         description: There are no messages that match the provided filters
 *       400:
 *         $ref: '#/components/responses/BadRequestOrInvalidToken'
 *       401:
 *         $ref: '#/components/responses/noTokenProvided'
 */

messageRouter.get(
  "/",
  querySchemaValidator(querySchemas.message),
  getAllMessage
);

/* prettier-ignore */

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     description: Update a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the message to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Message"
 *               content:
 *                 type: string
 *                 example: "This is the updated message content."
 *             required:
 *               - name
 *               - content
 *     responses:
 *       200:
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Updated Message"
 *                 content:
 *                   type: string
 *                   example: "This is the updated message content."
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdBy:
 *                   type: string
 *                   example: "user123"
 *                 createdDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *                 modifiedBy:
 *                   type: string
 *                   example: "user123"
 *                 modifiedDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *       400:
 *         description: Bad request, invalid data received
 *       404:
 *         description: Message with the given ID not found
 */

messageRouter.put("/:id", bodySchemaValidator(schemas.message), updateMessage);

/* prettier-ignore */

/**
 * @swagger
 * /messages/{id}:
 *   patch:
 *     description: Update a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the message to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Message"
 *               content:
 *                 type: string
 *                 example: "This is the updated message content."
 *             required:
 *               - name
 *               - content
 *     responses:
 *       200:
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Updated Message"
 *                 content:
 *                   type: string
 *                   example: "This is the updated message content."
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdBy:
 *                   type: string
 *                   example: "user123"
 *                 createdDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *                 modifiedBy:
 *                   type: string
 *                   example: "user123"
 *                 modifiedDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *       400:
 *         description: Bad request, invalid data received
 *       404:
 *         description: Message with the given ID not found
 */

messageRouter.patch("/:id", bodySchemaValidator(patchSchemas.message), updateMessage);

/* prettier-ignore */

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     description: Delete a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the message to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Sample Message"
 *                 content:
 *                   type: string
 *                   example: "This is a sample message content."
 *                 isActive:
 *                   type: boolean
 *                   example: false
 *                 createdBy:
 *                   type: string
 *                   example: "user123"
 *                 createdDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *                 modifiedBy:
 *                   type: string
 *                   example: "user123"
 *                 modifiedDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T12:34:56Z"
 *       400:
 *         description: Bad request, invalid ID format
 *       404:
 *         description: Message with the given ID not found
 */

messageRouter.delete("/:id", deleteMessage);

module.exports = messageRouter;
