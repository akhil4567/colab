import { Joi } from 'express-validation';

export const permissionValidation = {
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(100)
        .required(),
      key: Joi.string()
        .min(2)
        .max(100)
        .required(),
      description: Joi.string()
        .min(2)
        .max(100)
        .required()
    })
      .unknown(),
  }