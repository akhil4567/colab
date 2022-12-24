import { Joi } from 'express-validation';

export const roleValidation = {
    body: Joi.object({
      roleName: Joi.string()
        .min(2)
        .max(100)
        .required(),
      description: Joi.string()
        .min(1)
        .max(100)
        .required(),
      tenantId: Joi.string()
        .max(100),
    })
      .unknown(),
  }