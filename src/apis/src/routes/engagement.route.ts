import express from 'express';
import authMiddleware from '../common/middlewares/authentication';
import EngagementController from '../controllers/engagement.controller';
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants' ;
import { log } from '../common/classes/log.class';


const router = express.Router();
const multer = require('multer');
const storage: any = multer.memoryStorage()

const engagementAttachmentMulter = multer({ storage: storage });

router.get('/api/v1/engagement/all-engagements', authMiddleware,canAccess(Constants.VIEW_ALL_ENGAGEMENTS),  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EngagementController.getEngagements(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'success', ...result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post('/api/v1/engagement/create-engagement', engagementAttachmentMulter.single('file'),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EngagementController.createEngagementPublic(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put('/api/v1/engagement/edit-engagement/:id',/**canAccess(Constants.EDIT_ENGAGEMENTS),*/ async (req: express.Request, res: express.Response) => {
    try {
      const result = await EngagementController.editEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete('/api/v1/engagement/delete-engagement/:id', async (req: express.Request, res: express.Response) => {
    try {
      const result = await EngagementController.deleteEngagement(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: `Successfully Deleted ${result} row(s).` });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);


export { router as EngagementRouter }