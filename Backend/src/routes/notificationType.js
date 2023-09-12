const express = require("express");
const notificationTypeRouter = express.Router();
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
  createNotificationType,
  getNotificationType,
  getAllNotificationType,
  updateNotificationType,
  deleteNotificationType,
  getAllMessage,
} = require("../controllers/notificationType");

/* prettier-ignore */

/**
 * @swagger
 * tags:
 *   name: NotificationTypes
 *   description: API endpoints related to message module
 */

/**
 * @swagger
 * /notification-types/:
 *   post:
 *     description: Create a new notification type
 *     tags: [NotificationTypes]
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
 *                 description: Name of the notification type
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 255
 *                 description: Description of the notification type
 *               eventId:
 *                 type: string
 *                 minLength: 5
 *                 description: ID of the event associated with the notification type
 *               template_subject:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *                 description: Subject of the notification template
 *               template_body:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *                 description: Body of the notification template
 *             required:
 *               - name
 *               - description
 *               - eventId
 *               - template_subject
 *               - template_body
 *     responses:
 *       200:
 *         description: Notification type created successfully
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
 *                   example: "Sample Notification Type"
 *                 description:
 *                   type: string
 *                   example: "This is a sample notification type description."
 *                 eventId:
 *                   type: string
 *                   example: "event123"
 *                 template_subject:
 *                   type: string
 *                   example: "Sample Subject"
 *                 template_body:
 *                   type: string
 *                   example: "This is a sample notification template body."
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

notificationTypeRouter.post(
  "/",
  bodySchemaValidator(schemas.notificationType),
  createNotificationType
);

/* prettier-ignore */

/**
 * @swagger
 * /notification-types/{id}:
 *   get:
 *     description: Get a single notification type by ID
 *     tags: [NotificationTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the notification type to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the notification type
 *     responses:
 *       200:
 *         description: Successful operation
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
 *                   example: "Sample Notification Type"
 *                 description:
 *                   type: string
 *                   example: "This is a sample notification type description."
 *                 eventId:
 *                   type: string
 *                   example: "event123"
 *                 template_subject:
 *                   type: string
 *                   example: "Sample Subject"
 *                 template_body:
 *                   type: string
 *                   example: "This is a sample notification template body."
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
 *         description: Notification type with the given ID not found
 */

notificationTypeRouter.get("/:id", getNotificationType);

/* prettier-ignore */

/**
 * @swagger
 * /notification-types/{id}/messages:
 *   get:
 *     description: Fetches all messages for a specific notification type
 *     tags: [NotificationTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the notification type for which messages will be retrieved
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the notification type
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
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
 *           type: boolean
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
 *                   applicationId:
 *                     type: string
 *                     example: "application123"
 *                   eventId:
 *                     type: string
 *                     example: "event123"
 *                   notificationTypeId:
 *                     type: string
 *                     example: "notificationType123"
 *                   content:
 *                     type: string
 *                     example: "This is a sample message content."
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
 *       204:
 *         description: There are no messages that match the provided filters
 *       400:
 *         $ref: '#/components/responses/BadRequestOrInvalidToken'
 *       401:
 *         $ref: '#/components/responses/noTokenProvided'
 */

notificationTypeRouter.get(
  "/:id/messages",
  querySchemaValidator(querySchemas.message),
  getAllMessage
);

/* prettier-ignore */

/**
 * @swagger
 * /notification-types:
 *   get:
 *     description: Fetches all notification types
 *     tags: [NotificationTypes]
 *     parameters:
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *       - name: description
 *         in: query
 *         schema:
 *           type: string
 *       - name: eventId
 *         in: query
 *         schema:
 *           type: string
 *       - name: template_subject
 *         in: query
 *         schema:
 *           type: string
 *       - name: template_body
 *         in: query
 *         schema:
 *           type: string
 *       - name: isActive
 *         in: query
 *         schema:
 *           type: boolean
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
 *         description: Notification types have been fetched successfully
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
 *                     example: "Sample Notification Type"
 *                   description:
 *                     type: string
 *                     example: "This is a sample notification type."
 *                   eventId:
 *                     type: string
 *                     example: "event123"
 *                   template_subject:
 *                     type: string
 *                     example: "Sample Notification Subject"
 *                   template_body:
 *                     type: string
 *                     example: "This is a sample notification body."
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
 *       204:
 *         description: There are no notification types that match the provided filters
 *       400:
 *         $ref: '#/components/responses/BadRequestOrInvalidToken'
 *       401:
 *         $ref: '#/components/responses/noTokenProvided'
 */

notificationTypeRouter.get(
  "/",
  querySchemaValidator(querySchemas.notificationType),
  getAllNotificationType
);

/* prettier-ignore */

/**
 * @swagger
 * /notification-types/{id}:
 *   put:
 *     description: Update a notification type by ID
 *     tags: [NotificationTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the notification type to update
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
 *                 minLength: 5
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 255
 *               eventId:
 *                 type: string
 *                 minLength: 5
 *               template_subject:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *               template_body:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *             required:
 *               - name
 *               - description
 *               - eventId
 *               - template_subject
 *               - template_body
 *     responses:
 *       200:
 *         description: Notification type updated successfully
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
 *                   example: "Updated Notification Type"
 *                 description:
 *                   type: string
 *                   example: "This is an updated notification type."
 *                 eventId:
 *                   type: string
 *                   example: "updatedEvent123"
 *                 template_subject:
 *                   type: string
 *                   example: "Updated Notification Subject"
 *                 template_body:
 *                   type: string
 *                   example: "This is an updated notification body."
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
 *         description: Bad request, invalid data received or notification type not found
 *       401:
 *         $ref: '#/components/responses/noTokenProvided'
 */

notificationTypeRouter.put(
  "/:id",
  bodySchemaValidator(schemas.notificationType),
  updateNotificationType
);

/* prettier-ignore */

/**
 * @swagger
 * /notification-types/{id}:
 *   patch:
 *     description: Update a notification type by ID
 *     tags: [NotificationTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the notification type to update
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
 *                 minLength: 5
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 255
 *               eventId:
 *                 type: string
 *                 minLength: 5
 *               template_subject:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *               template_body:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *             required:
 *               - name
 *               - description
 *               - eventId
 *               - template_subject
 *               - template_body
 *     responses:
 *       200:
 *         description: Notification type updated successfully
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
 *                   example: "Updated Notification Type"
 *                 description:
 *                   type: string
 *                   example: "This is an updated notification type."
 *                 eventId:
 *                   type: string
 *                   example: "updatedEvent123"
 *                 template_subject:
 *                   type: string
 *                   example: "Updated Notification Subject"
 *                 template_body:
 *                   type: string
 *                   example: "This is an updated notification body."
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
 *         description: Bad request, invalid data received or notification type not found
 *       401:
 *         $ref: '#/components/responses/noTokenProvided'
 */

notificationTypeRouter.patch(
  "/:id",
  bodySchemaValidator(patchSchemas.notificationType),
  updateNotificationType
);

/* prettier-ignore */

/**
 * @swagger
 * /notification-types/{id}:
 *   patch:
 *     description: Update a notification type by ID
 *     tags: [NotificationTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the notification type to update
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
 *                 minLength: 5
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 255
 *               eventId:
 *                 type: string
 *                 minLength: 5
 *               template_subject:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *               template_body:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *             required:
 *               - name
 *               - description
 *               - eventId
 *               - template_subject
 *               - template_body
 *     responses:
 *       200:
 *         description: Notification type updated successfully
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
 *                   example: "Updated Notification Type"
 *                 description:
 *                   type: string
 *                   example: "This is an updated notification type."
 *                 eventId:
 *                   type: string
 *                   example: "updatedEvent123"
 *                 template_subject:
 *                   type: string
 *                   example: "Updated Notification Subject"
 *                 template_body:
 *                   type: string
 *                   example: "This is an updated notification body."
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
 *         description: Bad request, invalid data received or notification type not found
 *       401:
 *         $ref: '#/components/responses/noTokenProvided'
 */

notificationTypeRouter.patch(
  "/:id",
  bodySchemaValidator(patchSchemas.notificationType),
  updateNotificationType
);

/* prettier-ignore */

/**
 * @swagger
 * /notification-types/{id}:
 *   delete:
 *     description: Delete a notification type by ID
 *     tags: [NotificationTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the notification type to delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Notification type deleted successfully
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
 *                   example: "Deleted Notification Type"
 *                 description:
 *                   type: string
 *                   example: "This is a deleted notification type."
 *                 eventId:
 *                   type: string
 *                   example: "deletedEvent123"
 *                 template_subject:
 *                   type: string
 *                   example: "Deleted Notification Subject"
 *                 template_body:
 *                   type: string
 *                   example: "This is a deleted notification body."
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
 *         description: Bad request or notification type not found
 *       401:
 *         $ref: '#/components/responses/noTokenProvided'
 */

notificationTypeRouter.delete("/:id", deleteNotificationType);

module.exports = notificationTypeRouter;
