const app = require("express");
const router = app.Router();
const authenticateToken = require("../middlewares/tokenAuthenticator");

//routes
const eventRouter = require("./event");
const applicationRouter = require("./application");
const messageRouter = require("./message");
const notificationTypeRouter = require("./notificationType");
const userRouter = require("./user");
const authRouter = require("./auth");
const { traceIdValidator } = require("../middlewares/traceIdValidation");
const tagRouter = require("./tag");

//route middleware
router.use("/events", traceIdValidator, authenticateToken, eventRouter);
router.use(
  "/applications",
  traceIdValidator,
  authenticateToken,
  applicationRouter
);
router.use("/messages", traceIdValidator, authenticateToken, messageRouter);
router.use("/tags", traceIdValidator, authenticateToken, tagRouter);
router.use(
  "/notification-types",
  traceIdValidator,
  authenticateToken,
  notificationTypeRouter
);
router.use("/users", traceIdValidator, authenticateToken, userRouter);
router.use("/auth", traceIdValidator, authRouter);

module.exports = router;
