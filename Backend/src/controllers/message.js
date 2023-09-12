const Message = require("../models/message");
const Event = require("../models/event");
const NotificationType = require("../models/notificationType");
const { StatusCodes } = require("http-status-codes");
const knex = require("../knex");
const config = require("config");

const getAllMessage = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const messages = await knex("message")
      .where(queryParams)
      .limit(pageSize)
      .offset(offset);
    return res.send(messages);
  }
  const messages = await Message.find(queryParams).skip(offset).limit(pageSize);
  return res.send(messages);
};
const createMessage = async (req, res) => {
  if (config.get("server.db") === "postgres") {
    const notificationType = await knex("notificationType")
      .where("id", req.body.notificationTypeId)
      .first();
    const tags = req.body.tags;
    const templateBody = notificationType.templateBody;
    let messages = [];
    for (const tag of tags) {
      const message = templateBody.replace(
        /\{(\w+)\}/g,
        (match, p1) => tag[p1] || match
      );
      messages.push({
        text: message,
        isActive: true,
        createdBy: req.user.id || req.user._id,
        createdDate: new Date(),
        modifiedBy: req.user.id || req.user._id,
        modifiedDate: new Date(),
      });
    }
    const createdMessage = await knex("message")
      .insert(messages)
      .returning("*");
    return res.send(createdMessage);
  }
  const notificationType = await NotificationType.findById(
    req.body.notificationTypeId
  );
  const tags = req.body.tags;
  const templateBody = notificationType.templateBody;
  let messages = [];
  for (const tag of tags) {
    const message = templateBody.replace(
      /\{(\w+)\}/g,
      (match, p1) => tag[p1] || match
    );
    messages.push({
      text: message,
      isActive: true,
      createdBy: req.user.id || req.user._id,
      createdDate: new Date(),
      modifiedBy: req.user.id || req.user._id,
      modifiedDate: new Date(),
    });
  }
  let message = new Message(messages);
  message = await message.save();
  return res.send(message);
};

const updateMessage = async (req, res) => {
  const messageId = req.params.id;
  const reqBody = {
    ...req.body,
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const message = await knex("message")
      .where("id", messageId)
      .update(reqBody, ["*"]);

    if (!message.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The message with the given ID was not found." });
    }

    return res.send(message[0]);
  }
  const message = await Message.findByIdAndUpdate(messageId, reqBody, {
    new: true,
  });
  if (!message)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The message with the given ID was not found." });

  return res.send(message);
};

const deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const message = await knex("message")
      .where("id", messageId)
      .update(
        {
          isActive: false,
          modifiedDate: new Date(),
          modifiedBy: req.user.id || req.user._id,
        },
        ["*"]
      );
    if (!message.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The message with the given ID was not found." });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "The message with given Id is deleted" });
  }

  const message = await Message.findByIdAndUpdate(
    messageId,
    {
      isActive: false,
      modifiedDate: new Date(),
      modifiedBy: req.user.id || req.user._id,
    },
    { new: true }
  );

  if (!message)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The message with the given ID was not found." });

  return res
    .status(StatusCodes.OK)
    .json({ message: "The application with the given ID is deleted" });
};

const getMessage = async (req, res) => {
  const messageId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const message = await knex("message").where("id", messageId).first();

    if (!message) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The message with the given ID was not found." });
    }

    return res.send(message);
  }
  const message = await Message.find({
    _id: messageId,
  });

  if (!message)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The message with the given ID was not found." });

  return res.send(message);
};

module.exports = {
  getAllMessage,
  createMessage,
  updateMessage,
  getMessage,
  deleteMessage,
};
