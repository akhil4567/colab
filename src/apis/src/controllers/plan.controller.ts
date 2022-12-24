import express from 'express';
import PlanDao from '../daos/plan.dao';

class PlanController {

    async getAllPlans(req: express.Request, res: express.Response) {
        const result = await PlanDao.getPlans({
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async getDeletedPlans(req: express.Request, res: express.Response) {
        const result = await PlanDao.getDeletedPlans({
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async createPlan(req: express.Request, res: express.Response) {
        const result = await PlanDao.createPlan({
            ...req.body,
            user: req.user
        });
        return result;
    }

    async updatePlan(req: express.Request, res: express.Response) {
        const result = await PlanDao.updatePlan({
            id: req.params.id,
            user: req.user,
            ...req.body,
        });
        return result;
    }

    async deletePlan(req: express.Request, res: express.Response) {
        const result = await PlanDao.deletePlan({
            id: req.params.id,
            user: req.user,
            ...req.body,
        });
        return result;
    }
}

export default new PlanController();