const authenticateToken = require("../../../src/middlewares/tokenAuthenticator");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const config = require("config");

const createMocks = (token) => {
  const req = {
    header: jest.fn((headerName) =>
      headerName === "x-auth-token" ? token : undefined
    ),
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe("authenticateToken", () => {
  test("should call next middleware if valid token is provided", () => {
    const token = "valid-token";
    const { req, res, next } = createMocks(token);
    const user = { id: "user-id", username: "testuser" };

    jwt.verify = jest.fn((token, jwtPrivateKey, callback) => {
      callback(null, user);
    });

    authenticateToken(req, res, next);

    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("should respond with 401 if no token is provided", () => {
    const { req, res, next } = createMocks();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access denied. No token provided.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should respond with 403 if an invalid token is provided", () => {
    const token = "invalid-token";
    const { req, res, next } = createMocks(token);

    jwt.verify = jest.fn((token, jwtPrivateKey, callback) => {
      const err = new Error("Invalid token.");
      callback(err);
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token." });
    expect(next).not.toHaveBeenCalled();
  });
});
