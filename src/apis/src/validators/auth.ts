

import { Joi } from "express-validation";
import { isJSDocOverrideTag } from "typescript";

export const authValidation = {
  body: Joi.object({
    email: Joi.string().email().min(2).max(100).required(),
    password: Joi.string().min(3).max(30).required().label('Password'),
    passwordConfirmation: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
      firstName: Joi.string().min(2).max(100).required(),
      lastName: Joi.string().min(2).max(100).required(),
    contactNumber: Joi.string().min(5).max(18).required()
  }).unknown(),
};


export const addPasswordValidation = {
  body: Joi.object({
    password: Joi.string().min(3).max(30).required().label('Password'),
    passwordConfirmation: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
      
  }).unknown(),
};


export const resetPasswordValidationMail = {
  body: Joi.object({
     email: Joi.string().email().min(2).max(100).required()
      
  }).unknown(),
};

export const resetPasswordValidation = {
  body: Joi.object({
     password : Joi.string().min(3).max(30).required()
      
  }).unknown(),
};

export const confirmMailValidation = {
  body: Joi.object({
    tokenSecret : Joi.string().min(3).max(100).required()
      
  }).unknown(),
};

export const changePasswordValidation = {
  body: Joi.object({
     password : Joi.string().min(3).max(30).required(),
     oldPassword : Joi.string().min(3).max(30).required()
      
  }).unknown(),
};