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
  const filter = {
    isDeleted: false,
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
    const applications = await knex("application")
      .where(queryParams)
      .limit(pageSize)
      .offset(offset)
      .orderBy("name");
    return res.send(applications);
  }
  const applications = await Application.find(filter)
    .skip(offset)
    .limit(pageSize)
    .sort(sort);
  const totalCount = await Application.countDocuments(filter);
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

  const filter = {
    applicationId: applicationId,
    isDeleted: false,
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

  const events = await Event.find(filter)
    .skip(offset)
    .limit(pageSize)
    .sort(sort);
  const totalCount = await Event.countDocuments({
    isDeleted: false,
    applicationId: applicationId,
    ...queryParams,
  });
  return res.send({ events, totalCount });
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
    isDeleted: false,
    applicationId: applicationId,
    ...queryParams,
  })
    .skip(offset)
    .limit(pageSize);
  const totalCount = await Event.countDocuments({
    isDeleted: false,
    applicationId: applicationId,
    ...queryParams,
  });
  return res.send({ messages, totalCount });
};
const createApplication = async (req, res) => {
  const reqBody = {
    ...req.body,
    isActive: true,
    createdBy: req.user.firstName + " " + req.user.lastName,
    createdDate: new Date(),
    modifiedBy: req.user.firstName + " " + req.user.lastName,
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
    modifiedBy: req.user.firstName + " " + req.user.lastName,
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
          isDeleted: true,
          modifiedDate: new Date(),
          modifiedBy: req.user.firstName + " " + req.user.lastName,
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
      isDeleted: true,
      modifiedDate: new Date(),
      modifiedBy: req.user.firstName + " " + req.user.lastName,
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
