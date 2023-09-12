const convertJoiSchemaToJSON = (joiSchema) => {
  const { isJoi, _type, _settings, ...jsonSchema } = joiSchema.describe();
  return jsonSchema;
};

module.exports = { convertJoiSchemaToJSON };
