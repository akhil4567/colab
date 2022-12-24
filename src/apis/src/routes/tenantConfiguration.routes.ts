import express from 'express';
import { tenantConfigValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import authMiddleware from '../common/middlewares/authentication';
import { log } from '../common/classes/log.class';
import TenantConfigController from '../controllers/tenantConfig.controller';


const router = express.Router();
const multer = require('multer');
const storage: any = multer.memoryStorage()
const imageFileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/svg+xml") {

        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
}

const profileImageMulter = multer({ storage: storage, fileFilter: imageFileFilter });


router.get(
  '/api/v1/account/tenantConfig', authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await TenantConfigController.getTenantConfig(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get tenant config success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ statusCode: 500, error: error.message });
    }
  }
);

router.get(
    '/api/v1/account/tenantConfigs/deleted', authMiddleware, 
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await TenantConfigController.getDeletedTenantConfigs(req, res);
        return res
          .status(200)
          .json({ statusCode: 200, message: 'Get Deleted Tenant Configs success', data: result });
      } catch (error: any) {
        log.error(error);
        return res.status(500).json({ error: error.message });
      }
    }
  );



router.post('/api/v1/account/tenantConfig', authMiddleware, 
    validate(tenantConfigValidation, {}, {}), 
    parseError,  async (req: express.Request, res: express.Response) => {
      profileImageMulter.single('logo')(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ statusCode: 400,error: "Max file size limit exceeded" });
        }
        // INVALID FILE TYPE, message will return from fileFilter callback
        else if (err) {
          return res.status(500).json({ statusCode: 500, error: err.message });
        }
        else {
          const result = await TenantConfigController.updateOrCreateTenantConfig(req, res);
          return res
            .status(200)
            .json({ statusCode: 200, message: 'Tenant Config created or updated successfully', data: result });
        }
       }) 
});


router.delete(
  '/api/v1/account/tenantConfig/:id', authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await TenantConfigController.deleteTenantConfig(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Tenant Config deleted successfully', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as TenantConfigRouter };
