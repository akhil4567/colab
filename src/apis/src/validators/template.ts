import { Joi } from "express-validation";

export const emailTemplateValidation = {
  body: Joi.object({
    title: Joi.string().min(1).max(100).required(),
    subject: Joi.string().min(1).required(),
    body: Joi.string().min(1).required(),
  }).unknown(),
};

export const smsTemplateValidation = {
  body: Joi.object({
    title: Joi.string().min(1).max(100).required(),
    body: Joi.string().min(1).required(),
  }).unknown(),
};
