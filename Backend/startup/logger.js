const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, printf, label, timestamp, prettyPrint } = format;
const config = require("config");
const _ = require("lodash");

const logFormat = printf(({ level, message, traceId }) => {
  const _traceId = traceId ? ` [${traceId}] ` : " ";
  return JSON.stringify({ level, traceId: _traceId, message });
});

const logger = createLogger({
  exitOnError: false,
  level: config.get("server.logLevel") || "error",
  format: combine(timestamp(), logFormat, prettyPrint()),
  transports: [
    new winston.transports.File({
      filename: "errorfile.log",
      level: "error",
      colorize: true,
      timestamp: true,
      handleExceptions: true,
      json: true,
    }),
  ],
});

module.exports = logger;
