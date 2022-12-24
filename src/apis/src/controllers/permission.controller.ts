import express from 'express';
import PermissionDao from '../daos/permission.dao';

class PermissionController {

    async getAllPermissions(req: express.Request, res: express.Response) {
        const result = await PermissionDao.getPermissions({
            limit: req.query.limit || 20,
            offset: req.query.page || 1, 
            user:req.user
        });
        return result;
    }

    async createPermission(req: express.Request, res: express.Response) {
        const result = await PermissionDao.createPermission({
            ...req.body,
            user: req.user
        });
        return result;
    }

    async updatePermission(req: express.Request, res: express.Response) {
        const result = await PermissionDao.updatePermission({
            id: req.params.id,
            ...req.body,
            user: req.user,
        });
        return result;
    }

    async deletePermission(req: express.Request, res: express.Response) {
        const result = await PermissionDao.deletePermission({
            id: req.params.id,
            ...req.body,
            user: req.user,
        });
        return result;
    }
}

export default new PermissionController();
