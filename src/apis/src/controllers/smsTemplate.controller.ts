import express from 'express';
import SmsTemplateDao from '../daos/smsTemplate.dao';

class SmsTemplateController {

    async getAllSmsTemplate(req: express.Request, res: express.Response) {
        const result = await SmsTemplateDao.getAllTemplates({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async getDeletedSmsTemplates(req: express.Request, res: express.Response) {
        const result = await SmsTemplateDao.getDeleteSmsTemplate({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async createSmsTemplate(req: express.Request, res: express.Response) {
        const result = await SmsTemplateDao.createSmsTemplate({
            ...req.body, user: req.user
            
        });
        return result;
    }

    async updateSmsTemplate(req: express.Request, res: express.Response) {
        const result = await SmsTemplateDao.updateTemplate({
            id: req.params.id,
            ...req.body,  user: req.user
            
        });
        return result;
    }

    async deleteSmsTemplate(req: express.Request, res: express.Response) {
        const result = await SmsTemplateDao.deleteSmsTemplate({
            id: req.params.id,
            ...req.body,
            user: req.user
           
        });
        return result;
    }
}

export default new SmsTemplateController();
