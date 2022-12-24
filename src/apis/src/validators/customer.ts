const { Joi } = require('express-validation');

export const customerValidation = {
    body: Joi.object({
      firstName: Joi.string()
        .min(2)
        .max(100)
        .required(),
      middleName: Joi.string()
        .min(2)
        .max(100),
      lastName: Joi.string()
        .min(2)
        .max(100),
      customerType:Joi.string()
        .min(2)
        .max(100),
      gender:Joi.string()
        .min(2)
        .max(100)
        .required(),
      dateOfBirth:Joi.string()
        .min(2)
        .max(100)
        .required(),
      contactNumber:Joi.string()
        .min(2)
        .max(100)
        .required(),
      email: Joi.string()
        .email().required(),
      flag:Joi.string()
        .allow(null)
        .min(2)
        .max(100),
      reason:Joi.string()
        .allow(null)
        .min(2)
        .max(100),
      addressLine1:Joi.string()
        .min(2)
        .max(100).required(),
      addressLine2:Joi.string()
        .min(2)
        .max(100),
      city:Joi.string()
        .min(2)
        .max(100),
      country:Joi.string()
        .min(2)
        .max(100),
      zipcode:Joi.string()
        .min(2)
        .max(100),
      additionalData: Joi.object(),
    })
      .unknown(),
  }
