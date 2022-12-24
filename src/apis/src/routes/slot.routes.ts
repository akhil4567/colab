import express from 'express';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants' ;
import SlotController from '../controllers/slot.controller';
import { log } from '../common/classes/log.class';


const router = express.Router();

router.get('/api/v1/engagement/slots', authMiddleware,canAccess(Constants.VIEW_ALL_SLOTS), async (req: express.Request, res: express.Response) => {
    try {
      const result = await SlotController.getSlots(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'success', ...result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post('/api/v1/engagement/slot', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await SlotController.createSlot(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Creation Successful!', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete('/api/v1/engagement/delete-slot/:id', authMiddleware,canAccess(Constants.DELETE_SLOTS), async (req: express.Request, res: express.Response) => {
    try {
      const result = await SlotController.deleteSingleSlot(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Slot Deletion Successful!' });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put('/api/v1/engagement/edit-slot/:id', authMiddleware,canAccess(Constants.EDIT_SLOTS), async (req: express.Request, res: express.Response) => {
    try {
      const result = await SlotController.updateSingleSlot(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Slot Edit Successful!' });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put('/api/v1/engagement/edit-slot-series/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
      const result = await SlotController.updateSeriesSlot(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Slot Series Edit Successful!', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete('/api/v1/engagement/delete-slot-series/:id', authMiddleware,canAccess(Constants.DELETE_ALL_SLOTS), async (req: express.Request, res: express.Response) => {
    try {
      const result = await SlotController.deleteSeriesSlot(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Slot Series Deletion Successful!' });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get('/api/v1/engagement/public/slots',async (req: express.Request, res: express.Response) => {
  try {
    const result = await SlotController.publicGetSlots(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'success', ...result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
}
);

export { router as SlotRouter }