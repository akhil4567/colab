import express from 'express';
import {  parseError, userProfileValidation } from '../validators';
import { validate } from 'express-validation';
import authMiddleware from '../common/middlewares/authentication';
import { log } from '../common/classes/log.class';
import userProfileController from '../controllers/userProfile.controller';


const router = express.Router();



router.post('/api/v1/account/user-profile', authMiddleware, validate(userProfileValidation, {}, {}), parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await userProfileController.createUserProfile(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Create User Profile success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ statusCode: 500, message: 'An error occurred', error: error });
  }
});


router.put('/api/v1/account/user-profile/:id', authMiddleware, validate(userProfileValidation, {}, {}), parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await userProfileController.updateUserProfile(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Update User Profile success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ statusCode: 500, message: 'An error occurred', error: error });
  }
});


export { router as UserProfileRouter };
