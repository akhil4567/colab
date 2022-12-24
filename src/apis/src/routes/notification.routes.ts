import express from "express";
import { log } from "../common/classes/log.class";
import authMiddleware from '../common/middlewares/authentication';
import notificationController from "../controllers/notification.controller";

const router = express.Router();

router.post(
  "/api/v1/account/notification",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await notificationController.createNotification(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'successfully created notification', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error });
    }
  }
);

router.get(
  "/api/v1/account/notification",authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await notificationController.getAllNotifications(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'notification retrieved', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error });
    }
  }
);

router.put(
  "/api/v1/account/notification",authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await notificationController.markAsRead(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'notification edited successfully', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error });
    }
  }
);

export { router as notificationRouter };
