import express from 'express';
import FeatureController from '../controllers/feature.controller';
import { featureValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
import { log } from '../common/classes/log.class';

const router = express.Router();

router.get(
  '/api/v1/account/features', authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await FeatureController.getAllFeatures(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get Features success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  '/api/v1/account/feature/deleted', authMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await FeatureController.getDeletedFeatures(req, res);

      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get deleted features success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post('/api/v1/account/feature', authMiddleware, 
    validate(featureValidation, {}, {}), parseError, 
    async (req: express.Request, res: express.Response) => {
  try {
    const result = await FeatureController.createFeature(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'PostFeature success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/api/v1/account/feature/:id', authMiddleware, 
    validate(featureValidation, {}, {}), parseError, 
    async (req: express.Request, res: express.Response) => {
  try {
    const result = await FeatureController.updateFeature(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'UpdateFeature success', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete(
  '/api/v1/account/feature/:id/', authMiddleware, 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await FeatureController.deleteFeature(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'DeleteFeature success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as FeatureRouter };
