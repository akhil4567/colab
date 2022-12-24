import { Joi } from "express-validation";

export const locationValidation = {
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(100)
        .required(),
      status:Joi.string()
        .min(2)
        .max(100)
        .required(),
      locationLogitude: Joi.string()
        .min(2)
        .max(100)
        ,
      locationLatitude:Joi.string()
        .min(2)
        .max(100)
        ,
      address:Joi.string()
        .min(2)
        .max(100)
        ,
      unit:Joi.string()
        .min(1)
        .max(50),
      street:Joi.string()
        .min(2)
        .max(100),
      state:Joi.string()
        .min(2)
        .max(100),
      city:Joi.string()
        .min(2)
        .max(100),
      zipcode:Joi.string()
        .min(2)
        .max(10),
    })
      .unknown(),
  }
