import express from 'express';
import locationDao from '../daos/location.dao';

class LocationController {

    async getAllLocation(req: express.Request, res: express.Response) {
        const result = await locationDao.getLocations({
            order: req.query.order || 'ASC',
            sort: req.query.sort || 'name',
            search: req.query.search || null,
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async getDeleteLocations(req: express.Request, res: express.Response) {
        const result = await locationDao.getDeleteLocations({
            order: req.query.order || 'ASC',
            sort: req.query.sort || 'name',
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user:req.user
        });
        return result;
    }

    async createLocation(req: express.Request, res: express.Response) {
        const result = await locationDao.createLocation({
            ...req.body, user: req.user
            
            
        });
        return result;
    }

    async updateLocation(req: express.Request, res: express.Response) {
       
        const result = await locationDao.updateLocation({
            id: req.params.id,
            ...req.body, user: req.user

        });
        return result;
    }

    async deleteLocation(req: express.Request, res: express.Response) {
       
        const result = await locationDao.deleteLocation({
            id: req.params.id,
            user:req.user,
            ...req.body,
         
        });
        return result;
    }
}

export default new LocationController();
