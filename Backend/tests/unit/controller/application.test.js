const controllers = require("../../../src/controllers/application");
const { StatusCodes } = require("http-status-codes");
const config = require("config");
const Application = require("../../../src/models/application");
const Event = require("../../../src/models/event");
const Message = require("../../../src/models/message");
const knex = require("../../../src/knex");

describe("Application Controllers", () => {
  beforeEach(() => {
    // Clear all mock implementations and call counts before each test
    jest.clearAllMocks();
  });

  describe("getAllApplication", () => {
    it("should return all applications from Postgres", async () => {
      // Mock the configuration for Postgres database
      jest.spyOn(config, "get").mockReturnValue("postgres");

      // Mock the request and response objects
      const req = { query: { someKey: "someValue" } };
      const res = { send: jest.fn() };

      // Mock the knex query result
      const applications = [
        { id: 1, name: "App 1" },
        { id: 2, name: "App 2" },
      ];
      const whereMock = jest.fn().mockReturnValueOnce({
        orderBy: jest.fn().mockReturnThis(),
        // Mock the "then" method of the knex query to return the applications
        then: jest.fn().mockResolvedValueOnce(applications),
      });

      // Mock the knex object
      knex.mockReturnValueOnce({
        where: whereMock,
      });
      //   const whereMock = jest.fn().mockReturnValueOnce(applications);
      //   const orderByMock = jest.fn().mockReturnThis();
      //   knex.mockReturnValueOnce({ where: whereMock, orderBy: orderByMock });

      // Call the controller function
      await controllers.getAllApplication(req, res);

      // Verify the response
      expect(res.send).toHaveBeenCalledWith(applications);
    });

    it("should return all applications from MongoDB", async () => {
      // Mock the configuration for MongoDB
      jest.spyOn(config, "get").mockReturnValue("mongodb");

      // Mock the request and response objects
      const req = { query: { someKey: "someValue" } };
      const res = { send: jest.fn() };

      // Mock the MongoDB query result
      const applications = [
        { id: 1, name: "App 1" },
        { id: 2, name: "App 2" },
      ];
      Application.find.mockResolvedValueOnce(applications);

      // Call the controller function
      await controllers.getAllApplication(req, res);

      // Verify the response
      expect(res.send).toHaveBeenCalledWith(applications);
    });
  });
});
