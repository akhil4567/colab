import { Joi } from "express-validation";

export const outlookSendValidation = {
  body: Joi.object({
    providerId: Joi.string().min(2).max(100).required(),
    subject: Joi.string().min(1).max(500).required(),
    html: Joi.string().min(2).required(),
    toRecipients: Joi.array()
      .items({
        emailAddress: Joi.object({ name: Joi.string(), address: Joi.string() }),
      })
      .required(),
    ccRecipients: Joi.array().items({
      emailAddress: Joi.object({ name: Joi.string(), address: Joi.string() }),
    }),
    bccRecipients: Joi.array().items({
      emailAddress: Joi.object({ name: Joi.string(), address: Joi.string() }),
    }),
  }).unknown(),
};

export const outlookReplyValidation = {
  body: Joi.object({
    providerId: Joi.string().min(2).max(100).required(),
    emailId: Joi.string().max(500).required(),
    html: Joi.string().min(2).required(),
  }).unknown(),
};

export const outlookForwardValidation = {
  body: Joi.object({
    providerId: Joi.string().min(2).max(100).required(),
    emailId: Joi.string().max(500).required(),
    toRecipients: Joi.array()
      .items({
        emailAddress: Joi.object({ name: Joi.string(), address: Joi.string() }),
      })
      .required(),
    ccRecipients: Joi.array().items({
      emailAddress: Joi.object({ name: Joi.string(), address: Joi.string() }),
    }),
    bccRecipients: Joi.array().items({
      emailAddress: Joi.object({ name: Joi.string(), address: Joi.string() }),
    }),
  }).unknown(),
};
