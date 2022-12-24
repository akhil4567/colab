import { Joi } from "express-validation";

export const gmailSendValidation = {
  body: Joi.object({
    providerId: Joi.string().min(2).max(100).required(),
    subject: Joi.string().min(1).max(500).required(),
    html: Joi.string().min(2).required(),
    toRecipients: Joi.string().min(2).max(500).required(),
    ccRecipients: Joi.string().min(2).max(500),
    bccRecipients: Joi.string().min(2).max(500),
  }).unknown(),
};

export const gmailReplyValidation = {
  body: Joi.object({
    providerId: Joi.string().min(2).max(100).required(),
    subject: Joi.string().min(1).max(500).required(),
    html: Joi.string().min(2).required(),
    InReplyTo: Joi.string().max(200),
    References: Joi.string().max(200),
    MessageID: Joi.string().max(200),
    threadId: Joi.string().min(2).max(100).required(),
    toRecipients: Joi.string().min(2).max(500).required(),
    ccRecipients: Joi.string().min(2).max(500),
    bccRecipients: Joi.string().min(2).max(500),
  }).unknown(),
};
