const express = require("express");
const applicationRouter = express.Router();
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
  createApplication,
  getApplication,
  getAllApplication,
  getAllMessage,
  getAllEvent,
  updateApplication,
  deleteApplication,
} = require("../controllers/application");

/* prettier-ignore */
/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: API endpoints related to application module
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     description: Create a new application
 *     tags: [Applications]
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
 *             required:
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Application created successfully
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
 *                   example: "Sample Application"
 *                 description:
 *                   type: string
 *                   example: "This is a sample application description."
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

applicationRouter.post(
  "/",
  bodySchemaValidator(schemas.application),
  createApplication
);

/* prettier-ignore */

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     description: Get a single application by ID
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the application to retrieve
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
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Sample Application"
 *                 description:
 *                   type: string
 *                   example: "This is a sample application description."
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
 *         description: Application with the given ID not found
 */

applicationRouter.get("/:id", getApplication);

/* prettier-ignore */

/**
 * @swagger
 * /api/applications/{id}/events:
 *   get:
 *     description: Fetches all events containing the given application ID
 *     tags: [Applications]
 *     parameters:
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *       - name: applicationId
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

applicationRouter.get(
  "/:id/events",
  querySchemaValidator(querySchemas.event),
  getAllEvent
);

/* prettier-ignore */

/**
 * @swagger
 * /applications/{id}/messages:
 *   get:
 *     description: Fetches all messages containing given application ID
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the application to retrieve messages for
 *         required: true
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *       - name: content
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
 *                     example: "Sample Message"
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
 *         description: Bad request, invalid data received
 */

applicationRouter.get("/:id/messages", getAllMessage);

/* prettier-ignore */

/**
 * @swagger
 * /applications:
 *   get:
 *     description: Fetches all applications
 *     tags: [Applications]
 *     parameters:
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *       - name: description
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
 *         description: Applications have been fetched successfully
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
 *                     example: "Sample Application"
 *                   description:
 *                     type: string
 *                     example: "This is a sample application description."
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
 *         description: There are no applications that match the provided filters
 *       400:
 *         description: Bad request, invalid data received
 */

applicationRouter.get(
  "/",
  querySchemaValidator(querySchemas.application),
  getAllApplication
);

/* prettier-ignore */

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     description: Update an existing application
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the application to update
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
 *                 minLength: 5
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 255
 *             required:
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Application updated successfully
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
 *                   example: "Updated Application"
 *                 description:
 *                   type: string
 *                   example: "This is an updated application description."
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
 *         description: Application with the given ID not found
 */

applicationRouter.put(
  "/:id",
  bodySchemaValidator(schemas.application),
  updateApplication
);

/* prettier-ignore */

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     description: Update an existing application
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the application to update
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
 *                 minLength: 5
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 255
 *             required:
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Application updated successfully
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
 *                   example: "Updated Application"
 *                 description:
 *                   type: string
 *                   example: "This is an updated application description."
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
 *         description: Application with the given ID not found
 */

applicationRouter.patch(
  "/:id",
  bodySchemaValidator(patchSchemas.application),
  updateApplication
);

/* prettier-ignore */

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     description: Delete an application by ID
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the application to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application deleted successfully
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
 *                   example: "Deleted Application"
 *                 description:
 *                   type: string
 *                   example: "This is a deleted application description."
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
 *         description: Application with the given ID not found
 */

applicationRouter.delete("/:id", deleteApplication);

module.exports = applicationRouter;
