import express from 'express';
import PlanController from '../controllers/plan.controller';
import { planValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import { log } from '../common/classes/log.class';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants';

const router = express.Router();


router.get(
  '/api/v1/account/plans', authMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await PlanController.getAllPlans(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get all plans success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
    '/api/v1/account/plan/deleted', authMiddleware, 
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await PlanController.getDeletedPlans(req, res);
        return res
          .status(200)
          .json({ statusCode: 200, message: 'Get Deleted Plans success', data: result });
      } catch (error: any) {
        log.error(error);
        return res.status(500).json({ error: error.message });
      }
    }
  );

router.post('/api/v1/account/plan', authMiddleware,
    validate(planValidation, {}, {}), 
    parseError,  async (req: express.Request, res: express.Response) => {
  try {
    const result = await PlanController.createPlan(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Plan created successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/api/v1/account/plan/:id',
  authMiddleware, validate(planValidation, {}, {}), 
  parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await PlanController.updatePlan(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Plan updated successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete(
  '/api/v1/account/plan/:id', authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await PlanController.deletePlan(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Plan deleted successfully', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as PlanRouter };