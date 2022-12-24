import express from "express";
import { validate } from "express-validation";
import SmsTemplateController from "../controllers/smsTemplate.controller";
import { departmentValidation, parseError, smsTemplateValidation } from "../validators";
import authMiddleware from "../common/middlewares/authentication";
import { log } from "../common/classes/log.class";
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants' ;
const router = express.Router();
/**
 *  All route start with '/sms-template' will have authMiddleware.
 */
router.use("/api/v1/account/sms-template", authMiddleware);

/**
 *  Get all SmsTemplate of a Tenant
 */
router.get(
  "/api/v1/account/sms-template",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await SmsTemplateController.getAllSmsTemplate(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get SMS Template success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Get soft deleted SmsTemplate List
 */

router.get(
  "/api/v1/account/sms-template/deleted",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await SmsTemplateController.getDeletedSmsTemplates(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get Deleted SmsTemplate success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Create SMS Template.
 */

router.post(
  "/api/v1/account/sms-template",
  validate(smsTemplateValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await SmsTemplateController.createSmsTemplate(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "SMS Template created success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Update SMS Template.
 */

router.put(
  "/api/v1/account/sms-template/:id",
  validate(smsTemplateValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await SmsTemplateController.updateSmsTemplate(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Update Sms Template success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  '/api/v1/account/sms-template/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await SmsTemplateController.deleteSmsTemplate(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Delete SmsTemplate success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as SmsTemplateRouter };
