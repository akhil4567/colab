import express from "express";
import DepartmentDao from "../daos/department.dao";

class DepartmentController {

    async getAllDepartments(req: express.Request, res: express.Response) {
        const result = await DepartmentDao.getDepartment({

            user: req.user,
            order: req.query.order || 'ASC',
            sort: req.query.sort || 'name',
            search : req.query.search || null ,
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async getDeletedDepartments(req: express.Request, res: express.Response) {
        const result = await DepartmentDao.getDeletedDepartment({
            order: req.query.order || 'ASC',
            sort: req.query.sort || 'name',
            limit: req.query.limit || 20,
            offset: req.query.page || 1, user:req.user
        });
        return result;
    }

    

    async createDepartment(req: express.Request, res: express.Response) {
        const result = await DepartmentDao.createDepartment({
            ...req.body, user: req.user
            
        });
        return result;
    }

    async updateDepartment(req: express.Request, res: express.Response) {
       
        const result = await DepartmentDao.updateDepartment({
            id: req.params.id,
            ...req.body, user: req.user
        });
        return result;
    }

    async deleteDepartment(req: express.Request, res: express.Response) {
       
        const result = await DepartmentDao.deleteDepartment({
            id: req.params.id,
            user:req.user,
            ...req.body,
       
        });
        return result;
    }
}

export default new DepartmentController();
