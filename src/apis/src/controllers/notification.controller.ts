import express from 'express';
import NotifiactionDao from '../daos/notification.dao';
import {log} from '../common/classes/log.class'
class NotificationController {

    async getAllNotifications(req: express.Request, res: express.Response) {
        const result = await NotifiactionDao.getNotifications({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

   async markAsRead(req: express.Request, res: express.Response) {
    if(req.body.id){
        const result = await NotifiactionDao.markAsReadById({
            ...req.body,
            user: req.user
        });
        return result;
    }   

    if(req.body.markAllRead){
        const result = await NotifiactionDao.markAllAsRead({
            ...req.body,
            user: req.user
        });
        return result;
    }  
}

    async createNotification(req: express.Request, res: express.Response) {
        log.info("req",req.body);
        const result = await NotifiactionDao.createNotification({
            ...req.body,
            // limit: req.query.limit || 100,
            // offset: req.query.offset || 0
        });
        var io = req.app.get('socketio');
        io.emit('notification',
        ...req.body);
        return result;
    }

 
}

export default new NotificationController();
