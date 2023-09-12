const NotificationType = require("../models/notificationType");
const Event = require("../models/event");
const { StatusCodes } = require("http-status-codes");
const knex = require("../knex");
const config = require("config");
const Message = require("../models/message");
const { extractTags } = require("../utils/extractTags");

const getAllNotificationType = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const notificationTypes = await knex("notificationType")
      .where(queryParams)
      .limit(pageSize)
      .offset(offset)
      .orderBy("name");
    return res.send(notificationTypes);
  }
  const notificationTypes = await NotificationType.find(queryParams).sort(
    "name"
  );
  return res.send(notificationTypes);
};

const getAllMessage = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const notificationTypeId = req.params.id;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const queryParams = {};
    for (const key in req.query) {
      queryParams[key.toString()] = req.query[key];
    }
    const messages = await knex("message")
      .where("notificationTypeId", notificationTypeId)
      .where(queryParams)
      .limit(pageSize)
      .offset(offset);
    return res.send(messages);
  }
  const messages = await Message.find({
    notificationTypeId: notificationTypeId,
    queryParams,
  });
  return res.send(messages);
};

const createNotificationType = async (req, res) => {
  const tags = extractTags(req.body.templateBody);
  const reqBody = {
    ...req.body,
    tags,
    isActive: true,
    createdBy: req.user.id || req.user._id,
    createdDate: new Date(),
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const existingNotificationType = await knex("notificationType")
      .where("name", req.body.name)
      .where("eventId", req.body.eventId)
      .first();
    if (existingNotificationType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error:
          "This Notification already exists in this Event. Please create notification type with a different name",
      });
    }
    const createdNotificationType = await knex("notificationType")
      .insert(reqBody)
      .returning("*");
    return res.send(createdNotificationType);
  }
  let notificationType = new NotificationType(reqBody);
  notificationType = await notificationType.save();
  return res.send(notificationType);
};

const updateNotificationType = async (req, res) => {
  const notificationTypeId = req.params.id;
  const tags = extractTags(req.body.templateBody);
  const reqBody = {
    ...req.body,
    tags,
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const notificationType = await knex("notificationType")
      .where("id", notificationTypeId)
      .update(reqBody, ["*"]);

    if (!notificationType.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "The notificationType with the given ID was not found.",
      });
    }

    return res.send(notificationType[0]);
  }
  const notificationType = await NotificationType.findByIdAndUpdate(
    notificationTypeId,
    reqBody,
    { new: true }
  );
  if (!notificationType)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The notificationType with the given ID was not found." });

  return res.send(notificationType);
};

const deleteNotificationType = async (req, res) => {
  const notificationTypeId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const notificationType = await knex("notificationType")
      .where("id", notificationTypeId)
      .update(
        {
          isActive: false,
          modifiedDate: new Date(),
          modifiedBy: req.user.id || req.user._id,
        },
        ["*"]
      );
    if (!notificationType.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "The notification type with the given ID was not found.",
      });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "The notification type with given Id is deleted" });
  }

  const notificationType = await NotificationType.findByIdAndUpdate(
    notificationTypeId,
    {
      isActive: false,
      modifiedDate: new Date(),
      modifiedBy: req.user.id || req.user._id,
    },
    { new: true }
  );

  if (!notificationType)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The notificationType with the given ID was not found." });

  return res
    .status(StatusCodes.OK)
    .json({ message: "The application with the given ID is deleted" });
};

const getNotificationType = async (req, res) => {
  const notificationTypeId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const notificationType = await knex("notificationType")
      .where("id", notificationTypeId)
      .first();

    if (!notificationType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "The notificationType with the given ID was not found.",
      });
    }

    return res.send(notificationType);
  }
  const notificationType = await NotificationType.find({
    _id: notificationTypeId,
  });

  if (!notificationType)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The notificationType with the given ID was not found." });

  return res.send(notificationType);
};

module.exports = {
  getAllNotificationType,
  getAllMessage,
  createNotificationType,
  updateNotificationType,
  getNotificationType,
  deleteNotificationType,
};
