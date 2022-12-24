import { Joi } from 'express-validation';

export const planValidation = {
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(100)
        .required(),
      price: Joi.string()
        .min(1)
        .max(100),
      status:Joi.string()
        .min(2)
        .max(100),
      type: Joi.string()
        .max(100),
      createdBy: Joi.string()
        .max(100),
      updatedBy: Joi.string()
        .max(100)
    })
      .unknown(),
  }