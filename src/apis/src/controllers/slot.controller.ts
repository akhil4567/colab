import express from 'express';
import moment from 'moment';
import SlotDao from '../daos/slot.dao';

class SlotController {

    async getSlots(req: express.Request, res: express.Response) {
        const result = await SlotDao.getSlots({
            user: req.user,
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            startDate: req.query.startdate || moment().startOf("day").utc().format(),
            endDate: req.query.enddate || moment().add(7, "days").endOf("day").utc().format(),
            departmentId: req.query.departmentId || null,
            locationId: req.query.locationId || null,
            engagementTypeId: req.query.engagementTypeId || null,
            assignedTo: req.query.userId || null
        });
        return result;
    }

    async createSlot(req: express.Request, res: express.Response) {
        const result = await SlotDao.createSlot({
            ...req.body,
            user:req.user
        });
        return result;
    }

    async deleteSingleSlot(req: express.Request, res: express.Response) {
        const result = await SlotDao.deleteSingleSlot({
            slotId: req.params.id,
            ...req.body, user:req.user
        });
        return result;
    }

    async updateSingleSlot(req: express.Request, res: express.Response) {
        const result = await SlotDao.updateSingleSlot({
            slotId: req.params.id,
            ...req.body ,  user:req.user
        });
        return result;
    }

    async updateSeriesSlot(req: express.Request, res: express.Response) {
        const result = await SlotDao.updateSeriesSlot({
            slotId: req.params.id,
            ...req.body,
            user:req.user
        });
        return result;
    }
    
    async deleteSeriesSlot(req: express.Request, res: express.Response) {
        const result = await SlotDao.deleteSeriesSlot({
            slotId: req.params.id,
            user:req.user
        });
        return result;
    }

    async publicGetSlots(req: express.Request, res: express.Response) {
        const result = await SlotDao.publicGetSlots({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            startDate: req.query.startdate,
            endDate: req.query.enddate,
            tenantId: req.query.tenantId || null,
            departmentId: req.query.departmentId || null,
            locationId: req.query.locationId || null,
            engagementTypeId: req.query.engagementTypeId || null,
            assignedTo: req.query.userId || null
        });
        return result;
    }
}

export default new SlotController();
