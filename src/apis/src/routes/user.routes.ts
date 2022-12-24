import express from 'express';
import UserController from '../controllers/user.controller';
import { userValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
const multer = require('multer');
import { log } from '../common/classes/log.class';
import { changeTenantValidation, userInviteConfirmValidation } from '../validators/user';
import inviteAuthMiddleware from '../common/middlewares/inviteAuthentication';


const router = express.Router();

const storage: any = multer.memoryStorage()
const imageFileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
}

const profileImageMulter = multer({ storage: storage, fileFilter: imageFileFilter });

router.get(
  '/api/v1/account/users', authMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await UserController.getAllUsers(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'success', ...result });
    } catch (error: any) {
      log.error(error);
      
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  '/api/v1/account/user/deleted', authMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await UserController.getDeletedUsers(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get Deleted Users success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Get one User => ME Api
 */

router.get(
  '/api/v1/account/user', authMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await UserController.getOneUser(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  '/api/v1/account/user-invite-confirm', authMiddleware, validate(userInviteConfirmValidation, {}, {}), parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await UserController.inviteConfirm(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Accept Invite success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  '/api/v1/account/invite-user', inviteAuthMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await UserController.getInviteUser(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get Invite User Success.', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post('/api/v1/account/user', authMiddleware, validate(userValidation, {}, {}), parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await UserController.createUser(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ statusCode: 500, message: 'An error occurred', error: error.message });
  }
});

router.post('/api/v1/account/user/change-tenant', authMiddleware, validate(changeTenantValidation, {}, {}), parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await UserController.changeTenant(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Tenant Change Success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ statusCode: 500, message: 'An error occurred', error: error.message });
  }
});






router.put('/api/v1/account/user/:id',authMiddleware, validate(userValidation, {}, {}), parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await UserController.updateUser(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ statusCode: 500, message: 'An error occurred', error: error.message });
  }
});

router.post(
  '/api/v1/account/user-profile-image', authMiddleware, 
  profileImageMulter.single('image'),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await UserController.uploadProfileImage(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Profile Image uploaded successfully', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ statusCode: 500, message: 'An error occurred', error: error.message });
    }
  }
);

// router.delete(
//   '/api/v1/account/user/:id', authMiddleware, 
//   async (req: express.Request, res: express.Response) => {
//     try {
//       const result = await UserController.deleteUser(req, res);
//       return res
//         .status(200)
//         .json({ statusCode: 200, message: 'success', data: result });
//     } catch (error: any) {
//       log.error(error);
//       return res.status(500).json({ error: error.message });
//     }
//   }
// );
export { router as UserRouter };
