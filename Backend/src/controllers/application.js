const Application = require("../models/application");
const Event = require("../models/event");
const { StatusCodes } = require("http-status-codes");
const knex = require("../knex");
const config = require("config");
const Message = require("../models/message");

const getAllApplication = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;

  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const applications = await knex("application")
      .where(queryParams)
      .limit(pageSize)
      .offset(offset)
      .orderBy("name");
    return res.send(applications);
  }
  const applications = await Application.find(queryParams)
    .skip(offset)
    .limit(pageSize)
    .sort("name");
  const totalCount = await Application.countDocuments(queryParams);
  return res.send({ applications, totalCount });
};

const getAllEvent = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const applicationId = req.params.id;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const application = await knex("application")
      .where("id", applicationId)
      .first();

    if (!application) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The application with the given ID was not found." });
    }
    const events = await knex("event")
      .where("applicationId", applicationId)
      .where(queryParams)
      .limit(pageSize)
      .offset(offset);
    return res.send(events);
  }
  const application = await Application.findById(applicationId);
  if (!application)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The application with the given ID was not found." });
  const events = await Event.find({
    applicationId: applicationId,
    queryParams,
  })
    .skip(offset)
    .limit(pageSize);
  return res.send(events);
};

const getAllMessage = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const offset = (page - 1) * pageSize;
  const applicationId = req.params.id;
  const queryParams = {};
  for (const key in req.query) {
    if (!(req.query[key] == page || req.query[key] == pageSize))
      queryParams[key.toString()] = req.query[key];
  }
  if (config.get("server.db") === "postgres") {
    const application = await knex("application")
      .where("id", applicationId)
      .first();

    if (!application) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The application with the given ID was not found." });
    }
    const messages = await knex("message")
      .where("applicationId", applicationId)
      .where(queryParams)
      .limit(pageSize)
      .offset(offset);
    return res.send(messages);
  }
  const application = await Application.findById(applicationId);
  if (!application)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The application with the given ID was not found." });
  const messages = await Message.find({
    applicationId: applicationId,
    queryParams,
  })
    .skip(offset)
    .limit(pageSize);
  return res.send(messages);
};
const createApplication = async (req, res) => {
  const reqBody = {
    ...req.body,
    isActive: true,
    createdBy: req.user.id || req.user._id,
    createdDate: new Date(),
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const existingApplication = await knex("application")
      .where("name", req.body.name)
      .first();
    if (existingApplication) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Application already registered." });
    }
    const createdApplication = await knex("application")
      .insert(reqBody)
      .returning("*");
    return res.send(createdApplication);
  }
  const existingApplication = await Application.findOne({
    name: req.body.name,
  });
  "application :", existingApplication;
  if (existingApplication) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Application already registered." });
  }
  let application = new Application(reqBody);
  application = await application.save();
  return res.send(application);
};

const updateApplication = async (req, res) => {
  const applicationId = req.params.id;
  const reqBody = {
    ...req.body,
    modifiedBy: req.user.id || req.user._id,
    modifiedDate: new Date(),
  };
  if (config.get("server.db") === "postgres") {
    const application = await knex("application")
      .where("id", applicationId)
      .update(reqBody, ["*"]);

    if (!application.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The application with the given ID was not found." });
    }

    return res.send(application[0]);
  }
  const application = await Application.findByIdAndUpdate(
    applicationId,
    reqBody,
    { new: true }
  );
  if (!application)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The application with the given ID was not found." });

  return res.send(application);
};

const deleteApplication = async (req, res) => {
  const applicationId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const application = await knex("application")
      .where("id", applicationId)
      .update(
        {
          isActive: false,
          modifiedDate: new Date(),
          modifiedBy: req.user.id || req.user._id,
        },
        ["*"]
      );
    if (!application.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The application with the given ID was not found." });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "The application with given Id is deleted" });
  }

  const application = await Application.findByIdAndUpdate(
    applicationId,
    {
      isActive: false,
      modifiedDate: new Date(),
      modifiedBy: req.user.id || req.user._id,
    },
    { new: true }
  );

  if (!application)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The application with the given ID was not found." });

  return res
    .status(StatusCodes.OK)
    .json({ message: "The application with the given ID is deleted" });
};

const getApplication = async (req, res) => {
  const applicationId = req.params.id;
  if (config.get("server.db") === "postgres") {
    const application = await knex("application")
      .where("id", applicationId)
      .first();

    if (!application) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The application with the given ID was not found." });
    }

    return res.send(application);
  }
  const application = await Application.find({
    _id: applicationId,
  });

  if (!application)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The application with the given ID was not found." });

  return res.send(application);
};

module.exports = {
  getAllApplication,
  getAllMessage,
  getAllEvent,
  createApplication,
  updateApplication,
  getApplication,
  deleteApplication,
};
