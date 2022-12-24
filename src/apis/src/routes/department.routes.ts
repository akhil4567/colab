import express from "express";
import { validate } from "express-validation";
import DepartmentController from "../controllers/department.controller";
import { departmentValidation, parseError } from "../validators";
import authMiddleware from "../common/middlewares/authentication";
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants' ;
import { log } from "../common/classes/log.class";

const router = express.Router();
/**
 *  All route start with '/department' will have authMiddleware.
 */
router.use("/api/v1/account/department", authMiddleware);

/**
 *  Get all Department of a Tenant
 */
router.get(
  "/api/v1/account/department",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await DepartmentController.getAllDepartments(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "GetDepartment success",
          ...result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Get soft deleted Department List
 */

router.get(
  "/api/v1/account/department/deleted",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await DepartmentController.getDeletedDepartments(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Get Deleted Department success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Create Department along with location Details and Engagement Type
 *  present in the Department.
 */

router.post(
  "/api/v1/account/department",
  validate(departmentValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await DepartmentController.createDepartment(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Department created success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Update Department
 */

router.put(
  "/api/v1/account/department/:id",
  validate(departmentValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await DepartmentController.updateDepartment(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "UpdateDepartment success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  '/api/v1/account/department/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await DepartmentController.deleteDepartment(req, res);
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "DeleteDepartment success",
          data: result,
        });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as DepartmentRouter };
