import express from "express";
import EmailProviderController from "../controllers/emailProvider.controller";

import authMiddleware from "../common/middlewares/authentication";
import { log } from "../common/classes/log.class";

const router = express.Router();
/**
 *  All route start with '/email-provider' will have authMiddleware.
 */
router.use("/api/v1/account/email-provider", authMiddleware);

/**
 *  Get all Department of a Tenant
 */
router.get(
  "/api/v1/account/email-provider",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailProviderController.getAllProvider(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get Email Provider success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Get soft deleted Email Provider List
 */

router.get(
  "/api/v1/account/email-provider/deleted",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailProviderController.getDeletedEmailProviders(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get Deleted Email Provider success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);


/**
 *  Update Email Provider.
 */

router.put(
  "/api/v1/account/email-provider",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailProviderController.updateEmailProvider(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Update Email Provider success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  '/api/v1/account/email-provider/',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EmailProviderController.deleteEmailProvider(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Delete Email Provider success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as EmailProviderRouter };
