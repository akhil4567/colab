import { Joi } from 'express-validation';

export const onboardingTenantValidation = {
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(100)
        .required(),
      status:Joi.string()
        .min(2)
        .max(100)
        .required(),
      type: Joi.string()
        .max(100),
      addressLine1: Joi.string()
        .max(5000)
        .allow('', null),
      addressLine2: Joi.string()
        .max(5000)
        .allow('', null),
      street: Joi.string()
        .max(1000)
        .allow('', null),
      city: Joi.string()
        .max(1000)
        .allow('', null),
      state: Joi.string()
        .max(1000)
        .allow('', null),
      country: Joi.string()
        .max(1000)
        .allow('', null),
      zipCode: Joi.string()
        .max(1000)
        .allow('', null),
    })
      .unknown(),
  }