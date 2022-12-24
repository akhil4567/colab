import express from "express";
import { validate } from "express-validation";
import { log } from "../common/classes/log.class";

const router = express.Router();

router.post(
  "/api/v1/websocket",
  async (req: express.Request, res: express.Response) => {
    try {
      var io = req.app.get('socketio');
      io.emit('notification',{
        customerId:"123",
        number:"9872345542"
      });
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "websocket message sent!!",
          data: {},
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

export { router as websocketRouter };
