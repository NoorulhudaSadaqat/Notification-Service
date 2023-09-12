const Joi = require("joi");

const schemas = {
  auth: Joi.object().keys({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  }),
  user: Joi.object().keys({
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  }),
  application: Joi.object().keys({
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(255).required(),
    code: Joi.string().max(10).required(),
  }),
  event: Joi.object().keys({
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(255).required(),
    applicationId: Joi.string().required(),
  }),
  notificationType: Joi.object().keys({
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(255).required(),
    eventId: Joi.string().required(),
    templateSubject: Joi.string().min(5).max(255).required(),
    templateBody: Joi.string().min(5).max(255).required(),
  }),
  message: Joi.object().keys({
    tags: Joi.array().min(1).required(),
    applicationId: Joi.string().required(),
    eventId: Joi.string().required(),
    notificationTypeId: Joi.string().required(),
  }),
  tag: Joi.object().keys({
    label: Joi.string().min(5).max(255).required(),
  }),
};

const patchSchemas = {
  auth: Joi.object()
    .keys({
      email: Joi.string().min(5).max(255).optional().email(),
      password: Joi.string().min(5).max(255).optional(),
    })
    .min(1),
  user: Joi.object()
    .keys({
      firstName: Joi.string().min(3).max(255).optional(),
      lastName: Joi.string().min(3).max(255).optional(),
      email: Joi.string().min(5).max(255).optional().email(),
      password: Joi.string().min(5).max(255).optional(),
    })
    .min(1),
  application: Joi.object()
    .keys({
      name: Joi.string().min(5).max(255).optional(),
      description: Joi.string().min(100).max(255).optional(),
      code: Joi.string().max(255).optional(),
    })
    .min(1),
  event: Joi.object()
    .keys({
      name: Joi.string().min(5).max(255).optional(),
      description: Joi.string().min(100).max(255).optional(),
      applicationId: Joi.string().min(5).optional(),
    })
    .min(1),
  notificationType: Joi.object()
    .keys({
      name: Joi.string().min(5).max(255).optional(),
      description: Joi.string().min(100).max(255).optional(),
      eventId: Joi.string().min(5).optional(),
      templateSubject: Joi.string().min(5).max(255).optional(),
      templateBody: Joi.string().min(5).max(255).optional(),
    })
    .min(1),
  message: Joi.object().keys({
    tags: Joi.array().min(1).optional(),
    applicationId: Joi.string().min(5).optional(),
    eventId: Joi.string().min(5).optional(),
    notifcationTypeId: Joi.string().min(5).optional(),
    tags: Joi.object().optional(),
  }),
  tag: Joi.object()
    .keys({
      label: Joi.string().min(5).max(255).optional(),
    })
    .min(1),
};

const querySchemas = {
  application: Joi.object().keys({
    name: Joi.string().optional(),
    code: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    createdBy: Joi.string().optional(),
    createdDate: Joi.date().optional(),
    modifiedBy: Joi.string().optional(),
    modifiedDate: Joi.date().optional(),
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
  }),
  event: Joi.object().keys({
    name: Joi.string().optional(),
    applicationId: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    createdBy: Joi.string().optional(),
    createdDate: Joi.date().optional(),
    modifiedBy: Joi.string().optional(),
    modifiedDate: Joi.date().optional(),
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
  }),
  notificationType: Joi.object().keys({
    name: Joi.string().optional(),
    eventId: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    createdBy: Joi.string().optional(),
    createdDate: Joi.date().optional(),
    modifiedBy: Joi.string().optional(),
    modifiedDate: Joi.date().optional(),
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
  }),
  message: Joi.object().keys({
    applicationId: Joi.string().optional(),
    eventId: Joi.string().optional(),
    notifcationTypeId: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    createdBy: Joi.string().optional(),
    createdDate: Joi.date().optional(),
    modifiedBy: Joi.string().optional(),
    modifiedDate: Joi.date().optional(),
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
  }),
  tag: Joi.object().keys({
    label: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    createdBy: Joi.string().optional(),
    createdDate: Joi.date().optional(),
    modifiedBy: Joi.string().optional(),
    modifiedDate: Joi.date().optional(),
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
  }),
};

module.exports = { schemas, querySchemas, patchSchemas };
