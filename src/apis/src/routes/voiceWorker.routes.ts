import express from 'express';
import authMiddleware from '../common/middlewares/authentication';
import { log } from '../common/classes/log.class';
import voiceWorkerController from '../controllers/voiceWorker.controller';

const router = express.Router();

router.post('/api/v1/account/voice/twilio-worker', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await voiceWorkerController.getWorkerToken(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'worker token', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ statusCode: 500, message: 'An error occurred', error: error });
  }
});

router.put('/api/v1/account/voice/update-number', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await voiceWorkerController.updateCommunicationVoiceNumber(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Voice Number updated successfully.', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ statusCode: 500, message: 'An error occurred', error: error });
  }
});

export { router as VoiceWorkerRouter };
