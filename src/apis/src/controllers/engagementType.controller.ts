import express from 'express';
import EngagementTypeDao from '../daos/engagementType.dao';

class EngagementTypeController {

    async getEngagementTypes(req: express.Request, res: express.Response) {
        const result = await EngagementTypeDao.getEngagementTypes({
            departmentId : req.params.departmentId
        });
        return result;
    }
    
    async createEngagementType(req: express.Request, res: express.Response) {
        const result = await EngagementTypeDao.createEngagementType({
            ...req.body , user: req.user 
        });
        return result;
    }

    async updateEngagementType(req: express.Request, res: express.Response) {
        const result = await EngagementTypeDao.updateEngagementType({
            ...req.body , user:req.user ,id: req.params.id 
        });
        return result;
    }

    async deleteEngagementType(req: express.Request, res: express.Response) {
        const result = await EngagementTypeDao.deleteEngagementType({
            engagementTypeId: req.params.id, user:req.user
        });
        return result;
    }
}

export default new EngagementTypeController();
