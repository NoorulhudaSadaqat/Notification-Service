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
  const events = await Event.find({
    isDeleted: false,
    ...queryParams,
  })
    .skip(offset)
    .limit(pageSize)
    .sort("name");

  const totalCount = await Event.countDocuments({
    isDeleted: false,
    ...queryParams,
  });
  return res.send({ events, totalCount });
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

  const filter = {
    isDeleted: false,
    eventId: eventId,
    $or: [
      { name: { $regex: new RegExp(queryParams.search, "i") } },
      { description: { $regex: new RegExp(queryParams.search, "i") } },
    ],
  };
  if (queryParams.isActive !== undefined) {
    filter.isActive = queryParams.isActive;
  }

  const sort = {};
  if (queryParams.sortOrder === "ascending") {
    sort[queryParams.sortBy] = 1;
  } else {
    sort[queryParams.sortBy] = -1;
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
  const notificationTypes = await NotificationType.find(filter)
    .skip(offset)
    .limit(pageSize)
    .sort(sort);
  const totalCount = await NotificationType.countDocuments({
    isDeleted: false,
    eventId: eventId,
    ...queryParams,
  });
  return res.send({ notificationTypes, totalCount });
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
    isDeleted: false,
    eventId: eventId,
    ...queryParams,
  })
    .skip(offset)
    .limit(pageSize);
  const totalCount = await Message.countDocuments({
    isDeleted: false,
    ...queryParams,
  });
  return res.send({ messages, totalCount });
};
const createEvent = async (req, res) => {
  const reqBody = {
    ...req.body,
    isActive: true,
    createdBy: req.user.firstName + " " + req.user.lastName,
    createdDate: new Date(),
    modifiedBy: req.user.firstName + " " + req.user.lastName,
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
    name: req.body.name.trim(),
    applicationId: req.body.applicationId,
    isDeleted: false,
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
    modifiedBy: req.user.firstName + " " + req.user.lastName,
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
  const eventForId = await Event.findById(eventId);
  const existingEvent = await Event.findOne({
    name: req.body.name.trim(),
    applicationId: req.body.applicationId,
    _id: { $ne: eventForId._id },
    isDeleted: false,
  });
  if (existingEvent) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error:
        "This Event already exists in this Application. Please create event with a different name",
    });
  }
  const event = await Event.findByIdAndUpdate(eventId, reqBody, { new: true });
  if (!event)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The event with the given ID was not found." });

  return res.send(event);
};

const deleteEvent = async (req, res) => {
  const eventIds = req.body.eventIds;
  if (config.get("server.db") === "postgres") {
    const event = await knex("event")
      .where("id", eventId)
      .update(
        {
          isDeleted: false,
          modifiedDate: new Date(),
          modifiedBy: req.user.firstName + " " + req.user.lastName,
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

  const updatedEvents = await Event.updateMany(
    { _id: { $in: eventIds } },
    {
      $set: {
        isDeleted: true,
        modifiedDate: new Date(),
        modifiedBy: req.user.firstName + " " + req.user.lastName,
      },
    },
    { new: true }
  );

  if (!updatedEvents)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The event with the given Id was not found." });

  return res
    .status(StatusCodes.OK)
    .json({ message: "The events with the given Id is deleted" });
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
