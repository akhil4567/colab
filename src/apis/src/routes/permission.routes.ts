import express from 'express';
import PermissionController from '../controllers/permission.controller';
import { permissionValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import authMiddleware from '../common/middlewares/authentication';
import { log } from '../common/classes/log.class';

const router = express.Router();

router.get(
  '/api/v1/account/permissions', authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await PermissionController.getAllPermissions(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get Permissions success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);


router.post('/api/v1/account/permission', authMiddleware, 
    validate(permissionValidation, {}, {}), parseError, 
    async (req: express.Request, res: express.Response) => {
  try {
    const result = await PermissionController.createPermission(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'PostPermission success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/api/v1/account/permission/:id', authMiddleware, 
    validate(permissionValidation, {}, {}), parseError, 
    async (req: express.Request, res: express.Response) => {
  try {
    const result = await PermissionController.updatePermission(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'UpdatePermission success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete(
  '/api/v1/account/permission/:id/', authMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await PermissionController.deletePermission(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'DeletePermission success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as PermissionRouter };
