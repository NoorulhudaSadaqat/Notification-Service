const express = require("express");
const eventRouter = express.Router();
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
  createEvent,
  getEvent,
  getAllEvent,
  updateEvent,
  deleteEvent,
  getAllNotificationType,
  getAllMessage,
} = require("../controllers/event");

/* prettier-ignore */
/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: API endpoints related to application module
 */

/**
 * @swagger
 * /events:
 *   post:
 *     description: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 255
 *               isActive:
 *                 type: boolean
 *               createdBy:
 *                 type: string
 *               createdDate:
 *                 type: string
 *                 format: date-time
 *               modifiedBy:
 *                 type: string
 *               modifiedDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Event created successfully
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
 *                   example: "Sample Event"
 *                 description:
 *                   type: string
 *                   example: "This is a sample event description."
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
 */

eventRouter.post("/", bodySchemaValidator(schemas.event), createEvent);

/* prettier-ignore */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     description: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the event to retrieve
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
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "Sample Event"
 *                 description:
 *                   type: string
 *                   example: "This is a sample event description."
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
 *         description: Event with the given ID not found
 */

eventRouter.get("/:id", getEvent);

/* prettier-ignore */

/**
 * @swagger
 * /events/{id}/notification-types:
 *   get:
 *     description: Fetches all notification types for a specific event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the event to retrieve notification types for
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Notification types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "Sample Notification Type"
 *                   description:
 *                     type: string
 *                     example: "This is a sample notification type."
 *                   eventId:
 *                     type: integer
 *                     example: 1
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *                   createdBy:
 *                     type: string
 *                     example: "user123"
 *                   createdDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-07-24T12:34:56Z"
 *                   modifiedBy:
 *                     type: string
 *                     example: "user123"
 *                   modifiedDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-07-24T12:34:56Z"
 *       400:
 *         description: Bad request, invalid ID format
 */

eventRouter.get(
  "/:id/notification-types",
  querySchemaValidator(querySchemas.notificationType),
  getAllNotificationType
);

/* prettier-ignore */

/**
 * @swagger
 * /events/{id}/messages:
 *   get:
 *     description: Fetches all messages for a specific event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the event to retrieve messages for
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   text:
 *                     type: string
 *                     example: "Sample Message"
 *                   eventId:
 *                     type: integer
 *                     example: 1
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *                   createdBy:
 *                     type: string
 *                     example: "user123"
 *                   createdDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-07-24T12:34:56Z"
 *                   modifiedBy:
 *                     type: string
 *                     example: "user123"
 *                   modifiedDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-07-24T12:34:56Z"
 *       400:
 *         description: Bad request, invalid ID format
 */

eventRouter.get(
  "/:id/messages",
  querySchemaValidator(querySchemas.message),
  getAllMessage
);

/* prettier-ignore */

/**
 * @swagger
 * /events:
 *   get:
 *     description: Fetches all events
 *     tags: [Events]
 *     parameters:
 *       - name: name
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
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Sample Event"
 *                   description:
 *                     type: string
 *                     example: "This is a sample event."
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *                   createdBy:
 *                     type: string
 *                     example: "user123"
 *                   createdDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-07-24T12:34:56Z"
 *                   modifiedBy:
 *                     type: string
 *                     example: "user123"
 *                   modifiedDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-07-24T12:34:56Z"
 *       400:
 *         description: Bad request, invalid query parameters
 */

eventRouter.get("/", querySchemaValidator(querySchemas.event), getAllEvent);

/* prettier-ignore */

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     description: Update an event by ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the event to update
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Event updated successfully
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
 *                   example: "Updated Event"
 *                 description:
 *                   type: string
 *                   example: "This is an updated event."
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
 *         description: Bad request, invalid ID format or missing request body
 *       404:
 *         description: Event with the given ID not found
 */

eventRouter.put("/:id", bodySchemaValidator(schemas.event), updateEvent);

/* prettier-ignore */

/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     description: Update an event by ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the event to update
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Event updated successfully
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
 *                   example: "Updated Event"
 *                 description:
 *                   type: string
 *                   example: "This is an updated event."
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
 *         description: Bad request, invalid ID format or missing request body
 *       404:
 *         description: Event with the given ID not found
 */

eventRouter.patch("/:id", bodySchemaValidator(patchSchemas.event), updateEvent);

/* prettier-ignore */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     description: Delete an event by ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the event to delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Event deleted successfully
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
 *                   example: "Deleted Event"
 *                 description:
 *                   type: string
 *                   example: "This event has been deleted."
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
 *         description: Event with the given ID not found
 */

eventRouter.delete("/:id", deleteEvent);

module.exports = eventRouter;
