const path = require("path");

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      user: "noor",
      password: "password123",
      database: "mydatabase",
    },
    migrations: {
      // directory: "./migrations",
      directory: path.join(__dirname, "/migrations"),
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
