const bcrypt = require("bcrypt");
const _ = require("lodash");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const config = require("config");
const knex = require("../knex");

const signup = async (req, res) => {
  if (config.get("server.db") === "postgres") {
    const existingUser = await knex("user")
      .where("email", req.body.email)
      .first();
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const reqBody = {
      ...req.body,
      password,
      isActive: true,
      createdDate: new Date(),
    };
    const user = await knex("user").insert(reqBody).returning("*");
    const token = jwt.sign({ user }, config.get("server.jwtPrivateKey"), {
      expiresIn: 360000,
    });
    return res.send({ token, ...user });
  }
  let newUser = await User.findOne({ email: req.body.email });
  if (newUser)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "User already registered." });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const reqBody = {
    ...req.body,
    password,
    isActive: true,
    createdDate: new Date(),
  };
  newUser = new User({ ...reqBody });
  newUser = await newUser.save();
  const user = newUser._doc;
  const token = jwt.sign({ ...user }, config.get("server.jwtPrivateKey"), {
    expiresIn: 360000,
  });
  return res.send({ token, ...user });
};

const login = async (req, res) => {
  if (config.get("server.db") === "postgres") {
    const email = req.body.email;
    const password = req.body.password;
    const user = await knex("user").where("email", email).first();
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(user, config.get("server.jwtPrivateKey"), {
      expiresIn: 360000,
    });
    return res.send({ token });
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid credentials" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid credentials" });
  const token = jwt.sign(user.toJSON(), config.get("server.jwtPrivateKey"), {
    expiresIn: 360000,
  });
  return res.send(token);
};

module.exports = { signup, login };
