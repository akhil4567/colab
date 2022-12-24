import express from 'express';
import FeatureDao from '../daos/feature.dao';

class FeatureController {

    async getAllFeatures(req: express.Request, res: express.Response) {
        const result = await FeatureDao.getFeatures({
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async getDeletedFeatures(req: express.Request, res: express.Response) {
        const result = await FeatureDao.getDeletedFeatures({
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async createFeature(req: express.Request, res: express.Response) {
        const result = await FeatureDao.createFeature({
            ...req.body,
            user: req.user
        });
        return result;
    }

    async updateFeature(req: express.Request, res: express.Response) {
        const result = await FeatureDao.updateFeature({
            id: req.params.id,
            ...req.body,
            user: req.user,
        });
        return result;
    }

    async deleteFeature(req: express.Request, res: express.Response) {
        const result = await FeatureDao.deleteFeature({
            id: req.params.id,
            ...req.body,
            user: req.user,
        });
        return result;
    }
}

export default new FeatureController();
