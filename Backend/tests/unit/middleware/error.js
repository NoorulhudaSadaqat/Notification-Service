const errorMiddleware = require("../../../src/middlewares/error");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../../startup/logger");

jest.mock("../../../startup/logger", () => ({
  logger: {
    log: jest.fn(),
  },
}));

const createMocks = () => {
  const req = { headers: { traceid: "test-trace-id" } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe("errorMiddleware", () => {
  test("should respond with status 500 and error message for internal server errors", () => {
    const { req, res, next } = createMocks();
    const err = new Error("Something went wrong.");

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should respond with 500 and default error message if err.message is not provided", () => {
    const { req, res, next } = createMocks();
    const err = new Error();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(next).not.toHaveBeenCalled();
  });
});
