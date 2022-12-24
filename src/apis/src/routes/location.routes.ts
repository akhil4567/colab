import express from 'express';
import LocationController from '../controllers/location.controller';
import { locationValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants';
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
router.use('/api/v1/account/location',authMiddleware)


router.get(
  '/api/v1/account/location',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await LocationController.getAllLocation(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'GetLocation success', ...result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  '/api/v1/account/location/deleted',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await LocationController.getDeleteLocations(req, res);

      return res
        .status(200)
        .json({ statusCode: 200, message: 'GetLocation success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post('/api/v1/account/location',validate(locationValidation, {}, {}), parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await LocationController.createLocation(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'PostLocation success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/api/v1/account/location/:id',validate(locationValidation, {}, {}), parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await LocationController.updateLocation(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'UpdateLocation success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete(
  '/api/v1/account/location/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await LocationController.deleteLocation(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'DeleteLocation success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

export { router as LocationRouter };
