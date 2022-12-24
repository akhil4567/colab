import express from 'express';
import { logHelloWorld } from '../common/middlewares/hello-world';
import TenantController from '../controllers/tenant.controller';
import { onboardingTenantValidation, tenantValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
import { log } from '../common/classes/log.class';
import Constants from "../common/utils/Constants";

const router = express.Router();


router.get(
  '/api/v1/account/tenants', authMiddleware,
  canAccess(Constants.VIEW_ALL_TENANTS),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await TenantController.getAllTenants(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get all tenants success', ...result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  '/api/v1/account/tenant', authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await TenantController.getTenant(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get tenant success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
    '/api/v1/account/tenant/deleted', authMiddleware, 
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await TenantController.getDeletedTenants(req, res);
        return res
          .status(200)
          .json({ statusCode: 200, message: 'Get Deleted Tenants success', data: result });
      } catch (error: any) {
        log.error(error);
        return res.status(500).json({ error: error.message });
      }
    }
  );



router.post('/api/v1/account/tenant', authMiddleware, 
    canAccess(Constants.CREATE_TENANT),
    validate(tenantValidation, {}, {}), 
    parseError,  async (req: express.Request, res: express.Response) => {
  try {
    const result = await TenantController.createTenant(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Tenant created successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/api/v1/account/onboarding_tenant', authMiddleware, 
    validate(onboardingTenantValidation, {}, {}), 
    parseError,  async (req: express.Request, res: express.Response) => {
  try {
    const result = await TenantController.onboardingTenant(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Tenant onboarded successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/api/v1/account/tenant/:id',
  authMiddleware,
  canAccess(Constants.EDIT_TENANT),
  validate(tenantValidation, {}, {}), 
  parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await TenantController.updateTenant(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Tenant updated successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete(
  '/api/v1/account/tenant/:id', authMiddleware,
  canAccess(Constants.DELETE_TENANT),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await TenantController.deleteTenant(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Tenant deleted successfully', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as TenantRouter };
