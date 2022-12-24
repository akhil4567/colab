import express from 'express';
import DocumentDao from '../daos/document.dao';

class DocumentController {

    async getAllDocuments(req: express.Request, res: express.Response) {
        const result = await DocumentDao.getDocuments({
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async getDownloadLink(req: express.Request, res: express.Response) {
        const result = await DocumentDao.getDownloadLink({
            id: req.params.id,
        });
        return result;
    }

    async getDeletedDocuments(req: express.Request, res: express.Response) {
        const result = await DocumentDao.getDeletedDocuments({
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async createDocument(req: express.Request, res: express.Response) {
        const result = await DocumentDao.createDocument({
            ...req.body,
        });
        return result;
    }

    async updateDocument(req: express.Request, res: express.Response) {
        const result = await DocumentDao.updateDocument({
            id: req.params.id,
            ...req.body,
        });
        return result;
    }

    async deleteDocument(req: express.Request, res: express.Response) {
        const result = await DocumentDao.deleteDocument({
            id: req.params.id,
            ...req.body,
        });
        return result;
    }
}

export default new DocumentController();