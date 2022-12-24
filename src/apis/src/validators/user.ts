import { Joi } from "express-validation";

export const userValidation = {
  body: Joi.object({
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(1).max(100),
    email: Joi.string().email().required(),
    roleId: Joi.string().min(2).max(100).required(),
    status: Joi.string().min(2).max(100).required(),
    contactNumber: Joi.string().min(2).max(20).required(),
  }).unknown(),
};

export const userInviteConfirmValidation = {
  body: Joi.object({
    userMappingId: Joi.string().min(2).max(100).required(),
    inviteStatus: Joi.string().min(1).max(100).required(),
  }).unknown(),
};

export const changeTenantValidation = {
  body: Joi.object({
    tenantId: Joi.string().min(2).max(100).required(),
  }).unknown(),
};
