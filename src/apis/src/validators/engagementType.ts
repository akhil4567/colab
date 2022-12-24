import { Joi } from "express-validation";

export const engagementTypeValidation = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(100).required(),
    departmentId: Joi.string().min(2).max(100).required(),
    
  }).unknown(),
};
