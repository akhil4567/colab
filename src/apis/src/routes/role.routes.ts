import express from 'express';
import RoleController from '../controllers/role.controller';
import { roleValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import { log } from '../common/classes/log.class';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants';
const router = express.Router();


router.get(
  '/api/v1/account/roles', authMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await RoleController.getAllRoles(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get all roles success', ...result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post('/api/v1/account/role', authMiddleware,
    validate(roleValidation, {}, {}), 
    parseError,  async (req: express.Request, res: express.Response) => {
  try {
    const result = await RoleController.createRole(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Role created successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/api/v1/account/role/:id',
  authMiddleware, validate(roleValidation, {}, {}), 
  parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await RoleController.updateRole(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Role updated successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete(
  '/api/v1/account/role/:id', authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await RoleController.deleteRole(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Role deleted successfully', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(403).json({ statusCode: 403, error: error.message });
    }
  }
);
export { router as RoleRouter };