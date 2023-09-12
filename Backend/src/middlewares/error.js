const logger = require("../../startup/logger");
const { StatusCodes } = require("http-status-codes");

const errorMiddleware = (err, req, res, next) => {
  const message = err.message || "Internal Server Error";
  const traceId = req.headers.traceid;

  logger.log({
    level: "error",
    message: `${message} Error received with request body ${JSON.stringify(
      req.body
    )} and req params ${JSON.stringify(req.body)}`,
    traceId: traceId,
  });

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
};

module.exports = errorMiddleware;
