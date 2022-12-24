import express from 'express';
import { locationValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import authMiddleware from '../common/middlewares/authentication';
import { log } from '../common/classes/log.class';
//import {emails } from '../common/classes/email.class';
import { EmailComposer } from '../common/classes/email-composer.class';
import { Email } from '../common/classes/sendEmail.class';
import { joinReframeEmail } from '../common/templates/email/join-reframe';
import { passwordReset } from '../common/templates/email/password-reset';
import { register2faEmail } from '../common/templates/email/register2fa-email';
import { verifyEmail } from '../common/templates/email/verify-email';
const Handlebars = require("handlebars");


const router = express.Router();

// router.post('/mailInvite',async (req: express.Request, res: express.Response) => {
//     try {
  
//       let emailBody = EmailComposer.composeJoinReframeEmail(
//         {
//           userName: "MV",
//           loginEmail: "test@outlook.com",
//           // loginPassword: string,
//           // loginLink: any,
//           invitationValidity: "7",
//         }
//     );
//       const result = await Email.sendEmail({
//         to: ['mayureshv02@outlook.com','unleashedapicollection@gmail.com'],
//         subject: "Sending Email using Node.js",
//         html: emailBody
//     });
//       return res
//         .status(200)
//         .json({ statusCode: 200, message: 'Sent Successfully'  });
//     } catch (error: any) {
//       log.error(error);
//       return res.status(500).json({ error: error.message });
//     }
//   });
  
  router.post('/resetPassword',async (req: express.Request, res: express.Response) => {
    try {
      let emailBody = EmailComposer.composeResetPasswordEmail(
        {
          userName: "MV",
          resetPasswordLink: "",
          resetPasswordLinkValidity: "",
        }
    );
  
      const result = await Email.sendEmail({
        to: ['mayureshv02@outlook.com','unleashedapicollection@gmail.com'],
        subject: "Sending Email using Node.js",
        html:emailBody
    });
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Sent Successfully'  });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/register2fa',async (req: express.Request, res: express.Response) => {
    try {
  
      let emailBody = EmailComposer.composeregister2faEmail(
        {
          userName: "MV",
          otp: "546787",
          otpValidity: "15"
        }
    );
      const result = await Email.sendEmail({
       
        to: ['mayureshv02@outlook.com','unleashedapicollection@gmail.com'],
        subject: "Sending Email using Node.js",
        html: emailBody
    });
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Sent Successfully' });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/emailVerify',async (req: express.Request, res: express.Response) => {
    try {
      let emailBody = EmailComposer.composeverifyEmail(
        {
          userName: "MV",
          userEmail: "test@outlook.com",
          invitationValidity: "12",
        }
    );
      const result = await Email.sendEmail({
        to: ['mayureshv02@outlook.com','unleashedapicollection@gmail.com'],
        subject: "Sending Email using Node.js",
        html: emailBody
    });
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Sent Successfully'  });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  });

  export { router as EmailTestRouter };