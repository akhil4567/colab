import express from "express";
import { logHelloWorld } from "../common/middlewares/hello-world";
import TenantController from "../controllers/tenant.controller";
import {
  onboardingTenantValidation,
  tenantValidation,
  parseError,
} from "../validators";
import { validate } from "express-validation";
import authMiddleware from "../common/middlewares/authentication";
import { log } from "../common/classes/log.class";
import publicController from "../controllers/public.controller";

const router = express.Router();
router.get(
  "/api/v1/account/public/tenant-details/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await publicController.getTenantDetails(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get tenant-details... success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/api/v1/account/public/department/:tenantId",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await publicController.getPublicDepartments(req, res);
      return res.status(200).json({
        statusCode: 200,
        message: "Public Get Department",
        data: result,
      });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

export { router as PublicRouter };
