import { Joi } from 'express-validation';

export const departmentValidation = {
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(200)
        .required(),
      description: Joi.string()
        .min(2)
        .max(1000)
        .required(),
      status:Joi.string()
        .min(2)
        .max(100)
        .required(),
    })
      .unknown(),
  }