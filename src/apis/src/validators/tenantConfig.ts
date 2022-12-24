import { Joi } from 'express-validation';

export const tenantConfigValidation = {
    body: Joi.object({
      publicDescription: Joi.string()
        .min(2)
        .allow('', null),
      minutesBeforeBookingStops: Joi.number()
        .min(1)
        .max(10),
      confirmationEmailText: Joi.string()
        .min(2)
        .allow('', null),
      engagementEmailFooter: Joi.string()
        .min(2)
        .allow('', null),
      enableSmsReminder:Joi.boolean(),
      enableEmailReminder: Joi.boolean(),
      smsReminderTime: Joi.number(),
      emailReminderTime: Joi.number(),
      reminderEmailText: Joi.string()
        .min(2)
        .allow('', null),
      cancellationEmailText: Joi.string()
        .min(2)
        .allow('', null),
      rescheduleEmailText: Joi.string()
        .min(2)
        .allow('', null),
      enablePublicBooking: Joi.boolean(),
      bccEmails: Joi.array().items(Joi.string()),
    })
      .unknown(),
  }