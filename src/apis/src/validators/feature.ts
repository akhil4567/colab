import { Joi } from 'express-validation';

export const featureValidation = {
    body: Joi.object({
      name: Joi.string()
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