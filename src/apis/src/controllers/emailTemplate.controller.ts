import express from 'express';
import EmailTemplateDao from '../daos/emailTemplate.dao';

class EmailTemplateController {

    async getAllTemplate(req: express.Request, res: express.Response) {
        const result = await EmailTemplateDao.getAllTemplates({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async getDeletedEmailTemplates(req: express.Request, res: express.Response) {
        const result = await EmailTemplateDao.getDeleteEmailTemplate({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async createEmailTemplate(req: express.Request, res: express.Response) {
        const result = await EmailTemplateDao.createEmailTemplate({
            ...req.body, user: req.user
           
        });
        return result;
    }

    async updateEmailTemplate(req: express.Request, res: express.Response) {
        const result = await EmailTemplateDao.updateTemplate({
            id: req.params.id,
            ...req.body,  user: req.user
         
        });
        return result;
    }

    async deleteEmailTemplate(req: express.Request, res: express.Response) {
        const result = await EmailTemplateDao.deleteEmailTemplate({
            id: req.params.id,
            ...req.body,
            user: req.user
        
        });
        return result;
    }
}

export default new EmailTemplateController();
