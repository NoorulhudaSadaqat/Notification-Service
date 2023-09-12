const path = require("path");

module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // "^knex$": "<rootDir>/src/knexfile.js",
  },
};
