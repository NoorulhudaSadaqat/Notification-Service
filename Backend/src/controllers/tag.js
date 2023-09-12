const Tag = require("../models/tag");
const Event = require("../models/event");
const { StatusCodes } = require("http-status-codes");
const knex = require("../knex");
const config = require("config");
const Message = require("../models/message");

const getAllTag = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const tags = await knex("tag")
      .where(queryParams)
      .limit(pageSize)
      .offset(offset);
    return res.send(tags);
  }
  const tags = await Tag.find(queryParams);
  return res.send(tags);
};

const createTag = async (req, res) => {
  const reqBody = {
    ...req.body,
    isActive: true,
    createdBy: req.user.id || req.user._id,
    createdDate: new Date(),
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const createdTag = await knex("tag").insert(reqBody).returning("*");
    return res.send(createdTag);
  }
  let tag = new Tag(reqBody);
  tag = await tag.save();
  return res.send(tag);
};

const updateTag = async (req, res) => {
  const tagId = req.params.id;
  const reqBody = {
    ...req.body,
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const tag = await knex("tag").where("id", tagId).update(reqBody, ["*"]);

    if (!tag.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The tag with the given ID was not found." });
    }

    return res.send(tag[0]);
  }
  const tag = await Tag.findByIdAndUpdate(tagId, reqBody, { new: true });
  if (!tag)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The tag with the given ID was not found." });

  return res.send(tag);
};

const deleteTag = async (req, res) => {
  const tagId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const tag = await knex("tag")
      .where("id", tagId)
      .update(
        {
          isActive: false,
          modifiedDate: new Date(),
          modifiedBy: req.user.id || req.user._id,
        },
        ["*"]
      );
    if (!tag.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "The tag with the given ID was not found.",
      });
    }
    return res
      .status(StatusCodes.OK)
      .json({ error: "The tag with given Id is deleted" });
  }

  const tag = await Tag.findByIdAndUpdate(
    tagId,
    {
      isActive: false,
      modifiedDate: new Date(),
      modifiedBy: req.user.id || req.user._id,
    },
    { new: true }
  );

  if (!tag) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "The tag with the given ID was not found.",
    });
  }
  return res
    .status(StatusCodes.OK)
    .json({ error: "The tag with given Id is deleted" });
};

const getTag = async (req, res) => {
  const tagId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const tag = await knex("tag").where("id", tagId).first();

    if (!tag) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The tag with the given ID was not found." });
    }

    return res.send(tag);
  }
  const tag = await Tag.find({
    _id: tagId,
  });

  if (!tag)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The tag with the given ID was not found." });

  return res.send(tag);
};

module.exports = {
  getAllTag,
  createTag,
  updateTag,
  getTag,
  deleteTag,
};
