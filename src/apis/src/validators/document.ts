import { Joi } from 'express-validation';

export const documentValidation = {
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(500),
      documentType: Joi.string()
        .min(1)
        .max(500),
      fileKey:Joi.string()
        .min(2),
      fileName:Joi.string()
        .min(2)
        .max(500),
      mimeType: Joi.string()
        .max(100),
    })
      .unknown(),
  }