import express from 'express';
import DocumentController from '../controllers/document.controller';
import { documentValidation, parseError } from '../validators';
import { validate } from 'express-validation';
import { log } from '../common/classes/log.class';
import authMiddleware from '../common/middlewares/authentication';
import canAccess from '../common/middlewares/permission';
import Constants from '../common/utils/Constants';

const router = express.Router();


router.get(
  '/api/v1/account/documents',  
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await DocumentController.getAllDocuments(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Get all documents success', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
    '/api/v1/account/download_document/:id',  
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await DocumentController.getDownloadLink(req, res);
        return res
          .status(200)
          .json({ statusCode: 200, message: 'Get download link success', data: result });
      } catch (error: any) {
        log.error(error);
        return res.status(500).json({ error: error.message });
      }
    }
  );

router.get( '/api/v1/account/document/deleted',  
    async (req: express.Request, res: express.Response) => {
      try {
        const result = await DocumentController.getDeletedDocuments(req, res);
        return res
          .status(200)
          .json({ statusCode: 200, message: 'Get Deleted Documents success', data: result });
      } catch (error: any) {
        log.error(error);
        return res.status(500).json({ error: error.message });
      }
    }
  );

router.post('/api/v1/account/document', 
    validate(documentValidation, {}, {}), 
    parseError,  async (req: express.Request, res: express.Response) => {
  try {
    const result = await DocumentController.createDocument(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Document created successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/api/v1/account/document/:id',
   validate(documentValidation, {}, {}), 
  parseError, async (req: express.Request, res: express.Response) => {
  try {
    const result = await DocumentController.updateDocument(req, res);
    return res
      .status(200)
      .json({ statusCode: 200, message: 'Document updated successfully', data: result });
  } catch (error: any) {
    log.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/api/v1/account/document/:id', 
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await DocumentController.deleteDocument(req, res);
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Document deleted successfully', data: result });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
export { router as DocumentRouter };