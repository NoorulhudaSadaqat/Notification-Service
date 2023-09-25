const NotificationType = require("../models/notificationType");
const Event = require("../models/event");
const { StatusCodes } = require("http-status-codes");
const knex = require("../knex");
const config = require("config");
const Message = require("../models/message");
const { extractTags } = require("../utils/extractTags");
const Tag = require("../models/tag");

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
  const notificationTypes = await NotificationType.find({
    isDeleted: false,
    ...queryParams,
  }).sort("name");
  const totalCount = await NotificationType.countDocuments({
    isDeleted: false,
    ...queryParams,
  });
  return res.send({ notificationTypes, totalCount });
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
    isDeleted: false,
    notificationTypeId: notificationTypeId,
    ...queryParams,
  })
    .skip(offset)
    .limit(pageSize);
  const totalCount = await Message.countDocuments({
    isDeleted: false,
    notificationTypeId: notificationTypeId,
    ...queryParams,
  });
  return res.send({ messages, totalCount });
};

const createNotificationType = async (req, res) => {
  const tags = extractTags(req.body.templateBody);
  const reqBody = {
    ...req.body,
    tags,
    isActive: true,
    createdBy: req.user.firstName + " " + req.user.lastName,
    createdDate: new Date(),
    modifiedBy: req.user.firstName + " " + req.user.lastName,
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
  const existingNotification = await NotificationType.findOne({
    name: req.body.name.trim(),
    eventId: req.body.eventId,
    isDeleted: false,
  });
  if (existingNotification) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error:
        "This Notification already exists in this Event. Please create a notification with a different name",
    });
  }
  let notificationType = new NotificationType(reqBody);
  notificationType = await notificationType.save();
  let result = tags.map(async (tag) => {
    let existingTag = await Tag.findOne({ label: tag });
    if (!existingTag) {
      let newTag = new Tag({
        label: tag,
        isActive: true,
        createdBy: req.user.firstName + " " + req.user.lastName,
        createdDate: new Date(),
        modifiedBy: req.user.firstName + " " + req.user.lastName,
        modifiedDate: new Date(),
      });
      newTag = await newTag.save();
    }
  });
  return res.send(notificationType);
};

const updateNotificationType = async (req, res) => {
  const notificationTypeId = req.params.id;
  const tags = extractTags(req.body.templateBody);
  const reqBody = {
    ...req.body,
    tags,
    modifiedBy: req.user.firstName + " " + req.user.lastName,
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
  const notification = await NotificationType.findById(notificationTypeId);
  const existingNotification = await NotificationType.findOne({
    name: req.body.name.trim(),
    eventId: req.body.eventId,
    _id: { $ne: notification._id },
    isDeleted: false,
  });
  if (existingNotification) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error:
        "This Notification already exists in this Event. Please create a notification with a different name",
    });
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

  let result = tags.map(async (tag) => {
    let existingTag = await Tag.findOne({ label: tag });
    if (!existingTag) {
      let newTag = new Tag({
        label: tag,
        isActive: true,
        createdBy: req.user.firstName + " " + req.user.lastName,
        createdDate: new Date(),
        modifiedBy: req.user.firstName + " " + req.user.lastName,
        modifiedDate: new Date(),
      });
      newTag = await newTag.save();
    }
  });
  return res.send(notificationType);
};

const deleteNotificationType = async (req, res) => {
  const notificationTypeId = req.params.id;
  const notificationIds = req.body.notificationIds;

  if (config.get("server.db") === "postgres") {
    const notificationType = await knex("notificationType")
      .where("id", notificationTypeId)
      .update(
        {
          isDeleted: true,
          modifiedDate: new Date(),
          modifiedBy: req.user.firstName + " " + req.user.lastName,
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

  const updatedNotifications = await NotificationType.updateMany(
    { _id: { $in: notificationIds } },
    {
      $set: {
        isDeleted: true,
        modifiedDate: new Date(),
        modifiedBy: req.user.firstName + " " + req.user.lastName,
      },
    },
    { new: true }
  );

  if (!updatedNotifications)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The notification with the given ID was not found." });

  return res
    .status(StatusCodes.OK)
    .json({ message: "The notifications with the given Id is deleted" });
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
