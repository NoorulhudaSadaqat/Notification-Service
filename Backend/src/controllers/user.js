const _ = require("lodash");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const config = require("config");
const knex = require("../knex");
const debug = require("debug");

const getUser = async (req, res) => {
  if (config.get("server.db") === "postgres") {
    const userId = req.user.id || req.user._id;
    const user = await knex("user").where("id", userId).first();
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "The user with the given ID was not found." });
    }
    return res.send(user);
  }
  const userId = req.user._id;
  const user = await User.findOne({
    _id: userId,
  });

  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "The user with the given ID was not found." });

  return res.send(user);
};

module.exports = { getUser };
