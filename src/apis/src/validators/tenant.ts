import { Joi } from 'express-validation';

export const tenantValidation = {
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(100)
        .required(),
      contactName: Joi.string()
        .min(2)
        .max(100)
        .allow('', null),
      email: Joi.string()
        .email()
        .allow('', null),
      contactNumber: Joi.string()
        .min(2)
        .max(20)
        .allow('', null),
      status:Joi.string()
        .min(2)
        .max(100)
        .required(),
      type: Joi.string()
        .max(100)
        .required(),
      createdBy: Joi.string()
        .max(100),
      updatedBy: Joi.string()
        .max(100),
    })
      .unknown(),
  }