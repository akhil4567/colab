import express from 'express';
import TenantDao from '../daos/tenant.dao';
import createNumber from '../common/services/create-number';

class TenantController {

    async getAllTenants(req: express.Request, res: express.Response) {
        const result = await TenantDao.getTenants({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async getDeletedTenants(req: express.Request, res: express.Response) {
        const result = await TenantDao.getDeletedTenants({
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async createTenant(req: express.Request, res: express.Response) {
        const result = await TenantDao.createTenant({
            ...req.body,
            user: req.user
        });
        return result;
    }

    async getTenant(req: express.Request, res: express.Response) {
        const result = await TenantDao.getTenant({
            user: req.user
        });
        return result;
    }

    async onboardingTenant(req: express.Request, res: express.Response) {
        const result = await TenantDao.onboardingTenant({
            ...req.body,
            user: req.user
        });
        // Creating number table entries in Communication DB for sending sms and voice calls
        const createMessageNumber = await createNumber({
            clientTenantId: result.id,
            type: 'message',
        });
        const createVoiceNumber = await createNumber({
            clientTenantId: result.id,
            type: 'voice',
        });
        return result;
    }

    async updateTenant(req: express.Request, res: express.Response) {
        const result = await TenantDao.updateTenant({
            id: req.params.id,
            ...req.body,
            user: req.user,
        });
        return result;
    }

    async deleteTenant(req: express.Request, res: express.Response) {
        const result = await TenantDao.deleteTenant({
            id: req.params.id,
            ...req.body,
            user: req.user,
        });
        return result;
    }
}

export default new TenantController();
