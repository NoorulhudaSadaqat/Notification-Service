const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const config = require("config");
const debug = require("debug")("notificationApp");

const authenticateToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Access denied. No token provided." });

  jwt.verify(token, config.get("server.jwtPrivateKey"), (err, user) => {
    if (err) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid token." });
    }
    req.user = user;
    next();
  });
};
module.exports = authenticateToken;
