import { Joi } from "express-validation";

export const userProfileValidation = {
  body: Joi.object({
    gridItems: Joi.object().required(),
    gridLayout: Joi.object().required(),
  }).unknown(),
};
