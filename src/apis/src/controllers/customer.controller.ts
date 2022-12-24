import express from 'express';
import CustomerDao from '../daos/customer.dao';

class CustomerController {

    async getAllCustomers(req: express.Request, res: express.Response) {
        const result = await CustomerDao.getCustomers({
            order: req.query.order || 'ASC',
            sort: req.query.sort || 'firstName',
            search: req.query.search || null,
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async getDeleteCustomers(req: express.Request, res: express.Response) {
        const result = await CustomerDao.getDeleteCustomers({
            order: req.query.order || 'ASC',
            sort: req.query.sort || 'firstName',
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async createCustomer(req: express.Request, res: express.Response) {
        const result = await CustomerDao.createCustomers({
            ...req.body, user: req.user
            // limit: req.query.limit || 100,
            // offset: req.query.offset || 0
        });
        return result;
    }

    async updateCustomer(req: express.Request, res: express.Response) {
        const result = await CustomerDao.updateCustomers({
            id: req.params.id,
            ...req.body, user: req.user
            // limit: req.query.limit || 100,
            // offset: req.query.offset || 0
        });
        return result;
    }

    async deleteCustomer(req: express.Request, res: express.Response) {
        const result = await CustomerDao.deleteCustomers({
            id: req.params.id,
            ...req.body,
            user: req.user
            // limit: req.query.limit || 100,
            // offset: req.query.offset || 0
        });
        return result;
    }
}

export default new CustomerController();
