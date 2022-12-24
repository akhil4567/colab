import express from 'express';
import StaffEngagementDao from '../daos/staffEngagement.dao';
import { IVideo, IVideoResponse} from "../common/services/video";
import createVideoLink from "../common/services/video";
import moment from "moment-timezone";
let videoLink:IVideoResponse;
class StaffEngagementController {

    async getAllStaffEngagements(req: express.Request, res: express.Response) {
        const result = await StaffEngagementDao.getAllStaffEngagements({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user,
            search: req.query.search || null ,
            order: req.query.order || 'ASC',
            sort: req.query.sort || 'title',
            startDate: req.query.startdate || moment().startOf("day").utc().format(),
            endDate: req.query.enddate || moment().add(7, "days").endOf("day").utc().format(),
            organiserId: req.query.organiserId || null,
            userId: req.query.userId || null
        });
        return result;
    }

    async getAllStaffEngagementsDateCount(req: express.Request, res: express.Response) {
        const result = await StaffEngagementDao.getAllStaffEngagementsDateCount({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user,
            startDate: req.query.startdate || moment().startOf("day").utc().format(),
            endDate: req.query.enddate || moment().add(7, "days").endOf("day").utc().format(),
            organiserId: req.query.organiserId || null,
            userId: req.query.userId || null
        });
        return result;
    }


    

    async createStaffEngagement(req: express.Request, res: express.Response) {
        if(req.body.meetingType==="video"){
            const user:any =req.user 
            const video:IVideo ={

                organizerId: user.id,
                organizerName: `${user.firstName} ${user.lastName}`,
                status: "waiting",
                type: "scheduled",
                scheduleStartTime:req.body.engagementDateTime,
                tenantId: user.tenantId
              }
               videoLink = await createVideoLink(video);
              req.body.meetingLocation = videoLink.data.id
        }
       
        const result = await StaffEngagementDao.createStaffEngagement({
            user: req.user,
            ...req.body
        });
        
        return result;
    }

    async cancelSingleStaffEngagement(req: express.Request, res: express.Response) {
        const result = await StaffEngagementDao.cancelSingleStaffEngagement({
            staffEngagementId: req.params.id,
            user: req.user,
            ...req.body
        });
        return result;
    }

    async updateSingleStaffEngagement(req: express.Request, res: express.Response) {
        const result = await StaffEngagementDao.updateSingleStaffEngagement({
            staffEngagementId: req.params.id,
            user: req.user,
            ...req.body
        });
        return result;
    }

    async updateSeriesStaffEngagement(req: express.Request, res: express.Response) {
        const result = await StaffEngagementDao.updateSeriesStaffEngagement({
            staffEngagementId: req.params.id,
            user: req.user,
            ...req.body
        });
        return result;
    }
    
    async deleteSeriesStaffEngagement(req: express.Request, res: express.Response) {
        const result = await StaffEngagementDao.deleteSeriesStaffEngagement({
            staffEngagementId: req.params.id
        });
        return result;
    }

    async deactivateStaffEngagement(req: express.Request, res: express.Response) {
        const result = await StaffEngagementDao.deactivateStaffEngagement({
            staffEngagementId: req.params.id,
            user: req.user
        });
        return result;
    }

    async activateStaffEngagement(req: express.Request, res: express.Response) {
        const result = await StaffEngagementDao.activateStaffEngagement({
            staffEngagementId: req.params.id,
            user: req.user
        });
        return result;
    }
}

export default new StaffEngagementController();
