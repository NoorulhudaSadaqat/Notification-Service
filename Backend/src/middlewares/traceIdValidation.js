const { StatusCodes } = require("http-status-codes");

const traceIdValidator = (req, res, next) => {
  const traceId = req?.headers?.traceid | null;
  if (traceId) {
    next();
  } else {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ error: "traceid is missing in headers" });
  }
};

module.exports = { traceIdValidator };
