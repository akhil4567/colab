
import { db } from '../../../database/connection';
import { log } from "../common/classes/log.class";
import {NotificationInterfaceAttributes}  from "../../../database/models/notification"
const Sequelize = db.dbInterface.Sequelize;
let attributesExclusions = ['createdBy','updatedBy','deletedAt','createdAt','updatedAt','assignedTo','tenantId','departmentId','locationId','slotId','customerId','engagementTypeId','password','lastLoggedTenantId','refreshToken','googleId','outlookId'];


class NotifiactionDao {
  constructor() {
    
  }


  
  async getNotifications(data: any) {
  
    const {rows,count}: any = await db.dbInterface.models.Notification.findAndCountAll({
      where: {
        tenantId: data.user.tenantId,
        isRead:false
      },
      attributes: {
        exclude: attributesExclusions,
      },
      order: [["createdAt", "DESC"]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,distinct:true
    });

    return {data:rows,notificationCount:count};
  }

  async markAsReadById(data: any) {

   
      const notification: any = await db.dbInterface.models.Notification.update( 
      { isRead: true },
      {
        where: {
          id: data.id,
        },
      });
      return notification;


  }

  async markAllAsRead(data: any) {

    console.log(data)
    const notification: any = await db.dbInterface.models.Notification.update( 
      { isRead: true },
      {
        where: {
          userId: data.user.id,
        },
      });
      return notification;


}


  async createNotification(data: any) {
    let params : NotificationInterfaceAttributes = {
      tenantId:data.tenantId,
      data:data.data,
      type:data.type,
      isRead:false
    }
    if(data.userId){
      params.userId = data.userId
    }
    const notification: any = await db.dbInterface.models.Notification.create(params);
    log.info("notificationRes",notification)
    return notification;
  }

  // async getALlNotifications(data: any) {
 
  //   const connection: any = await db.dbInterface.models.UserConnection.destroy({
  //     where: { connectionId: data.id },
  //   });
  //   log.warn("user deleted"),connection[1]
  //   return connection[1];
  // }

}

export default new NotifiactionDao();