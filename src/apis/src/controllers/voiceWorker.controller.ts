import express from "express";
import voiceWorkerDao from "../daos/voiceWorker.dao";

class VoiceWorkerController {
  
  async getWorkerToken(req: express.Request, res: express.Response) {
    const result = await voiceWorkerDao.getWorkerToken({
      ...req.body,
      user: req.user,
    });
    return result;
  }
  async updateCommunicationVoiceNumber(req: express.Request, res: express.Response) {
    const result = await voiceWorkerDao.updateCommunicationVoiceNumber({
      ...req.body,
      user: req.user,
    });
    return result;
  }
}

export default new VoiceWorkerController();
