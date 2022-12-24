import express from 'express';
import RoleDao from '../daos/role.dao';

class RoleController {

    async getAllRoles(req: express.Request, res: express.Response) {
        const result = await RoleDao.getRoles({
            user: req.user,
            order: req.query.order || 'ASC',
            sort: req.query.sort || 'roleName',
            search: req.query.search || null,
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async createRole(req: express.Request, res: express.Response) {
        const result = await RoleDao.createRole({
            ...req.body,
            user: req.user
        });
        return result;
    }

    async updateRole(req: express.Request, res: express.Response) {
        const result = await RoleDao.updateRole({
            id: req.params.id,
            user: req.user,
            ...req.body,
        });
        return result;
    }

    async deleteRole(req: express.Request, res: express.Response) {
        const result = await RoleDao.deleteRole({
            id: req.params.id,
            user: req.user,
            ...req.body,
        });
        return result;
    }
}

export default new RoleController();