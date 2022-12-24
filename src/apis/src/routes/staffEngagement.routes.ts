import express from 'express';
import StaffEngagementController from '../controllers/staffEngagement.controller';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';

const router = express.Router();

router.get('/api/v1/engagement/staff-engagement', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await StaffEngagementController.getAllStaffEngagements(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'success', ...result });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post('/api/v1/engagement/staff-engagement', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await StaffEngagementController.createStaffEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Creation Successful!', data: result });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete('/api/v1/engagement/staff-engagement/cancel-single-meeting/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await StaffEngagementController.cancelSingleStaffEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Staff Engagement single-meeting Cancelled Successfully!' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put('/api/v1/engagement/staff-engagement/edit-single-meeting/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await StaffEngagementController.updateSingleStaffEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Staff Engagement single-meeting Edited Successfully!' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put('/api/v1/engagement/staff-engagement/edit-series/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await StaffEngagementController.updateSeriesStaffEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: result ? 'StaffEngagement Series Edit Successful!' : 'Nothing has been edited. Data unchanged.', data: result });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete('/api/v1/engagement/staff-engagement/delete-series/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await StaffEngagementController.deleteSeriesStaffEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Staff Engagement Series Deletion Successful!' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put('/api/v1/engagement/staff-engagement/deactivate/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await StaffEngagementController.deactivateStaffEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Staff Engagement Series Deactivated Successfully!' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put('/api/v1/engagement/staff-engagement/activate/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await StaffEngagementController.activateStaffEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Staff Engagement Series Re-Activated Successfully!' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);


export { router as StaffEngagementRouter }