import express from "express";
import { logHelloWorld } from "../common/middlewares/hello-world";
import CustomerController from "../controllers/customer.controller";
import { customerValidation, parseError } from "../validators";
import { validate } from "express-validation";
import authMiddleware from "../common/middlewares/authentication";
import { log } from "../common/classes/log.class";
import canAccess from "../common/middlewares/permission";
import Constants from "../common/utils/Constants";
const multer = require("multer");

const router = express.Router();
router.use("/api/v1/customer", authMiddleware);

const storage: any = multer.memoryStorage();
const imageFileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
  }
};

const profileImageMulter = multer({
  storage: storage,
  fileFilter: imageFileFilter,
});

router.get(
  "/api/v1/customer",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await CustomerController.getAllCustomers(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: "Get Customer  success", ...result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/api/v1/customer/deleted",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await CustomerController.getDeleteCustomers(req, res);

      return res.status(200).json({
        statusCode: 200,
        message: "Get Customer success",
        data: result,
      });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/customer",
  //canAccess(Constants.CREATE_CUSTOMER),
  validate(customerValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await CustomerController.createCustomer(req, res);
      return res.status(200).json({
        statusCode: 200,
        message: "Post Customer success",
        data: result,
      });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/api/v1/customer/:id",
  canAccess(Constants.EDIT_CUSTOMER),
  validate(customerValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await CustomerController.updateCustomer(req, res);
      return res.status(200).json({
        statusCode: 200,
        message: "Update Customer success",
        data: result,
      });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/api/v1/customer/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await CustomerController.deleteCustomer(req, res);
      return res.status(200).json({
        statusCode: 200,
        message: "Delete Customer success",
        data: result,
      });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

// router.post(
//   "/api/v1/customer-profile-image",
//   authMiddleware,
//   profileImageMulter.single("image"),
//   async (req: express.Request, res: express.Response) => {
//     try {
//       const result = await CustomerController.uploadProfileImage(req, res);
//       return res.status(200).json({
//         statusCode: 200,
//         message: "Customer Profile Image uploaded successfully",
//         data: result,
//       });
//     } catch (error: any) {
//       log.error(error);
//       return res.status(500).json({
//         statusCode: 500,
//         message: "An error occurred",
//         error: error.message,
//       });
//     }
//   }
// );

export { router as CustomerRouter };
