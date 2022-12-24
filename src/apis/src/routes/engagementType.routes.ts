import express from "express";
import EngagementTypeController from "../controllers/engagementType.controller";
import { log } from "../common/classes/log.class";
import { validate } from "express-validation";
import { parseError, engagementTypeValidation } from "../validators";
import canAccess from '../common/middlewares/permission';
import authMiddleware from "../common/middlewares/authentication";

const router = express.Router();
/**
 *  All route start with '/engagement-type' will have authMiddleware.
 */
router.use("/api/v1/account/engagement-type", authMiddleware);

/**
 * Get all the engagement types of a Particular Department
 */
router.get(
  "/api/v1/account/engagement-type/:departmentId",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EngagementTypeController.getEngagementTypes(
        req,
        res
      );
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get Engagement Types Success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/account/engagement-type",
  validate(engagementTypeValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EngagementTypeController.createEngagementType(
        req,
        res
      );
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Creation Successful!",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/api/v1/account/engagement-type/:id",
  validate(engagementTypeValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EngagementTypeController.updateEngagementType(
        req,
        res
      );
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Creation Successful!",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/api/v1/account/engagement-type/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await EngagementTypeController.deleteEngagementType(
        req,
        res
      );
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Engagement Type Deletion Successful!",
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

export { router as EngagementTypeRouter };
