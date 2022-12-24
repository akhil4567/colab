import express from "express";
import { validate } from "express-validation";
import EmailTemplateController from "../controllers/emailTemplate.controller";
import {  emailTemplateValidation, parseError } from "../validators/";
import authMiddleware from "../common/middlewares/authentication";
import { log } from "../common/classes/log.class";

const router = express.Router();
/**
 *  All route start with '/email-template' will have authMiddleware.
 */
router.use("/api/v1/account/email-template", authMiddleware);

/**
 *  Get all Department of a Tenant
 */
router.get(
  "/api/v1/account/email-template",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailTemplateController.getAllTemplate(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get Email Template success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Get soft deleted Email Template List
 */

router.get(
  "/api/v1/account/email-template/deleted",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailTemplateController.getDeletedEmailTemplates(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get Deleted Email Template success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Create Email Template 
 */

router.post(
  "/api/v1/account/email-template",
  validate(emailTemplateValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailTemplateController.createEmailTemplate(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Email Template created success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Update Email Template.
 */

router.put(
  "/api/v1/account/email-template/:id",
  validate(emailTemplateValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailTemplateController.updateEmailTemplate(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Update Email Template success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  '/api/v1/account/email-template/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailTemplateController.deleteEmailTemplate(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Delete Email Template success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as EmailTemplateRouter };
