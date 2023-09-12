const express = require("express");
const tagRouter = express.Router();
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
  createTag,
  getTag,
  getAllTag,
  updateTag,
  deleteTag,
} = require("../controllers/tag");

/* prettier-ignore */

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: API endpoints related to message module
 */

/**
 * @swagger
 * /tags/:
 *   post:
 *     description: Create a new tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *             required:
 *               - label
 *     responses:
 *       200:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 label:
 *                   type: string
 *                   example: "New Tag"
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
 *         description: Bad request or tag creation failed
 *       401:
 *         $ref: '#/components/responses/noTokenProvided'
 */

tagRouter.post("/", bodySchemaValidator(schemas.tag), createTag);

/* prettier-ignore */

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     description: Get a single tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the tag to retrieve
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
 *                 label:
 *                   type: string
 *                   example: "Tag Example"
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
 *         description: Bad request or tag with the given ID not found
 */

tagRouter.get("/:id", getTag);

/* prettier-ignore */

/**
 * @swagger
 * /tags:
 *   get:
 *     description: Get all tags
 *     tags: [Tags]
 *     parameters:
 *       - name: label
 *         in: query
 *         description: Label of the tag
 *         schema:
 *           type: string
 *       - name: isActive
 *         in: query
 *         description: Whether the tag is active or not
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Successful operation
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
 *                   label:
 *                     type: string
 *                     example: "Tag Example"
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
 *         description: Bad request
 */

tagRouter.get("/", querySchemaValidator(querySchemas.tag), getAllTag);

/* prettier-ignore */

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     description: Update a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the tag to update
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
 *               label:
 *                 type: string
 *                 example: "Updated Tag"
 *             required:
 *               - label
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
 *                 label:
 *                   type: string
 *                   example: "Updated Tag"
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
 *         description: Bad request, invalid ID format or missing label
 *       404:
 *         description: Tag with the given ID not found
 */

tagRouter.put("/:id", bodySchemaValidator(schemas.tag), updateTag);

/* prettier-ignore */

/**
 * @swagger
 * /tags/{id}:
 *   patch:
 *     description: Update a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the tag to update
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
 *               label:
 *                 type: string
 *                 example: "Updated Tag"
 *             required:
 *               - label
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
 *                 label:
 *                   type: string
 *                   example: "Updated Tag"
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
 *         description: Bad request, invalid ID format or missing label
 *       404:
 *         description: Tag with the given ID not found
 */

tagRouter.patch("/:id", bodySchemaValidator(patchSchemas.tag), updateTag);

/* prettier-ignore */

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     description: Delete a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the tag to delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
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
 *                 label:
 *                   type: string
 *                   example: "Deleted Tag"
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
 *         description: Bad request or invalid ID format
 *       404:
 *         description: Tag with the given ID not found
 */

tagRouter.delete("/:id", deleteTag);

module.exports = tagRouter;
