const express = require("express");
const genres = require("../routes/");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const error = require("../middleware/error");

const eventRouter = require("./routes/event");
const applicationRouter = require("./routes/application");
const messageRouter = require("./routes/message");
const notificationTypeRouter = require("./routes/notificationType");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
};

//routes
const eventRouter = require("./event");
const applicationRouter = require("./application");
const messageRouter = require("./message");
const notificationTypeRouter = require("./notificationType");

//route middleware
router.use("/events", eventRouter);
router.use("/applications", applicationRouter);
router.use("/messages", messageRouter);
router.use("/notification-types", notificationTypeRouter);

module.exports = router;
