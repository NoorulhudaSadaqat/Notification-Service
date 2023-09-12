const Event = require("../models/event");
const NotificationType = require("../models/notificationType");
const { StatusCodes } = require("http-status-codes");
const knex = require("../knex");
const config = require("config");
const Message = require("../models/message");

const getAllEvent = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const events = await knex("event")
      .where(queryParams)
      .limit(pageSize)
      .offset(offset)
      .orderBy("name");
    return res.send(events);
  }
  const events = await Event.find(queryParams)
    .skip(offset)
    .limit(pageSize)
    .sort("name");
  return res.send(events);
};

const getAllNotificationType = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const eventId = req.params.id;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const event = await knex("event").where("id", eventId).first();
    if (!event) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The event with the given ID was not found." });
    }
    const notifcationTypes = await knex("notificationType")
      .where("eventId", eventId)
      .limit(pageSize)
      .offset(offset)
      .where(queryParams);
    return res.send(notifcationTypes);
  }
  const event = await Event.findById(eventId);

  if (!event)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The event with the given ID was not found." });

  const notificationTypes = await NotificationType.find({
    eventId: eventId,
    ...queryParams,
  })
    .skip(offset)
    .limit(pageSize);
  return res.send(notificationTypes);
};

const getAllMessage = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const eventId = req.params.id;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const event = await knex("event").where("id", eventId).first();

    if (!event) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The event with the given ID was not found." });
    }
    const messages = await knex("message")
      .where("eventId", eventId)
      .where(queryParams)
      .limit(pageSize)
      .offset(offset);
    return res.send(messages);
  }
  const event = await Event.findById(eventId);

  if (!event)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The event with the given ID was not found." });

  const messages = await Message.find({
    eventId: eventId,
    ...queryParams,
  })
    .skip(offset)
    .limit(pageSize);
  return res.send(messages);
};
const createEvent = async (req, res) => {
  const reqBody = {
    ...req.body,
    isActive: true,
    createdBy: req.user.id || req.user._id,
    createdDate: new Date(),
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const existingEvent = await knex("event")
      .where("name", req.body.name)
      .where("applicationId", req.body.applicationId)
      .first();
    if (existingEvent) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error:
          "This Event already exists in this Application. Please create event with a different name",
      });
    }
    const createdEvent = await knex("event").insert(reqBody).returning("*");
    return res.send(createdEvent);
  }
  const existingEvent = await Event.findOne({
    name: req.body.name,
    applicationId: req.body.applicationId,
  });
  if (existingEvent) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error:
        "This Event already exists in this Application. Please create event with a different name",
    });
  }
  let event = new Event(reqBody);
  event = await event.save();
  return res.send(event);
};

const updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const reqBody = {
    ...req.body,
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const event = await knex("event")
      .where("id", eventId)
      .update(reqBody, ["*"]);

    if (!event.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The event with the given ID was not found." });
    }

    return res.send(event[0]);
  }
  const event = await Event.findByIdAndUpdate(eventId, reqBody, { new: true });
  if (!event)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The event with the given ID was not found." });

  return res.send(event);
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const event = await knex("event")
      .where("id", eventId)
      .update(
        {
          isActive: false,
          modifiedDate: new Date(),
          modifiedBy: req.user.id || req.user._id,
        },
        ["*"]
      );
    if (!event.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The eevnt with the given ID was not found." });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "The event with given Id is deleted" });
  }

  const event = await Event.findByIdAndUpdate(
    eventId,
    {
      isActive: false,
      modifiedDate: new Date(),
      modifiedBy: req.user.id || req.user._id,
    },
    { new: true }
  );

  if (!event)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The event with the given ID was not found." });

  return res
    .status(StatusCodes.OK)
    .json({ message: "The application with the given ID is deleted" });
};

const getEvent = async (req, res) => {
  const eventId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const event = await knex("event").where("id", eventId).first();

    if (!event) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The event with the given ID was not found." });
    }

    return res.send(event);
  }
  const event = await Event.find({
    _id: eventId,
  });

  if (!event)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The event with the given ID was not found." });

  return res.send(event);
};

module.exports = {
  getAllEvent,
  getAllMessage,
  getAllNotificationType,
  createEvent,
  updateEvent,
  getEvent,
  deleteEvent,
};
