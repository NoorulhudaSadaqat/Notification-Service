const { StatusCodes } = require("http-status-codes");

const bodySchemaValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => `body param ${i.message}`).join(",");
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ error: message });
    }
  };
};

const querySchemaValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => `query param ${i.message}`).join(",");
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ error: message });
    }
  };
};

module.exports = { bodySchemaValidator, querySchemaValidator };
