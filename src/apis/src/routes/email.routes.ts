import express from "express";
import { log } from "../common/classes/log.class";
import emailController from "../controllers/email.controller";
const Handlebars = require("handlebars");
import { validate } from "express-validation";
import { outlookSendValidation , outlookReplyValidation , outlookForwardValidation, parseError  , gmailReplyValidation , gmailSendValidation} from "../validators";


const router = express.Router();

router.get(
  "/api/v1/gmail-messages",
  async (req: express.Request, res: express.Response) => {
    try {
      let result = await emailController.getGmailInbox(req, res);

      return res.status(200).json({ statusCode: 200, message: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/send-gmail", validate(gmailSendValidation, {}, {}),
  parseError, 
  async (req: express.Request, res: express.Response) => {
    try {
      let result = await emailController.sendGmail(req, res);

      return res.status(200).json({ statusCode: 200, message: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/reply-gmail",  validate(gmailReplyValidation, {}, {}),
  parseError, 
  async (req: express.Request, res: express.Response) => {
    try {
      let result = await emailController.replyGmail(req, res);

      return res.status(200).json({ statusCode: 200, message: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/api/v1/outlook-messages",
  async (req: express.Request, res: express.Response) => {
    try {
      let result = await emailController.getOutlookInbox(req, res);

      return res.status(200).json({ statusCode: 200, result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/send-outlook",   validate(outlookSendValidation, {}, {}),
  parseError, 
  async (req: express.Request, res: express.Response) => {
    try {
      let result = await emailController.sendOutlook(req, res);

      return res.status(200).json({ statusCode: 200, ...result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/reply-outlook",validate(outlookReplyValidation, {}, {}),
  parseError, 
  async (req: express.Request, res: express.Response) => {
    try {
      let result = await emailController.replyOutlook(req, res);

      return res.status(200).json({ statusCode: 200, result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
router.post(
  "/api/v1/reply-all-outlook", validate(outlookReplyValidation, {}, {}),
  parseError, 
  async (req: express.Request, res: express.Response) => {
    try {
      let result = await emailController.replyAllOutlook(req, res);

      return res.status(200).json({ statusCode: 200, result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
router.post(
  "/api/v1/forward-outlook", validate(outlookForwardValidation, {}, {}),
  parseError, 
  async (req: express.Request, res: express.Response) => {
    try {
      let result = await emailController.forwardOutlook(req, res);

      return res.status(200).json({ statusCode: 200, result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

export { router as EmailRouter };
