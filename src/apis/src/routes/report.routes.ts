import express from 'express';
import EngagementController from '../controllers/engagement.controller';
import StaffEngagementController from '../controllers/staffEngagement.controller';
import { planValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import { log } from '../common/classes/log.class';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants';

const router = express.Router();


router.get('/api/v1/reports', authMiddleware,  async (req: express.Request, res: express.Response) => {
    try {
    
      const getAllStaffEngagementsDateCount = await StaffEngagementController.getAllStaffEngagementsDateCount(req, res);
      const getEngagementsDateCount = await EngagementController.getEngagementsDateCount(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'success' ,...getAllStaffEngagementsDateCount
                                                    ,...getEngagementsDateCount});
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

export { router as ReportRouter };