
import { db } from '../../../database/connection';
import { log } from "../common/classes/log.class";
const Sequelize = db.dbInterface.Sequelize;
const attributesExclusions = [
  "createdBy",
  "updatedBy",
  "deletedAt",
  "createdAt",
  "updatedAt",
];
class UserConnectionDao {
  constructor() {
    
  }


  async getUserConnectionByUser(data:any){

    const connections: any = await db.dbInterface.models.UserConnection.findAll({
      include: [
        {
          where: {
          userId: data.user.Id
          }
        },
      ],
    });

    return connections;
  }
  

  async createUserConnectionInDb(data: any) {
    log.info("websocket connection",data)
    const connection: any = await db.dbInterface.models.UserConnection.create({
       userId:data.auth.id,
       connectionId: data.id,
       tenantId:data.auth.tenantId
    });

    return connection;
  }

  async deleteUserConnectionInDb(data: any) {
 
    const connection: any = await db.dbInterface.models.UserConnection.destroy({
      where: { connectionId: data.id },
    });
    log.warn("user deleted"),connection[1]
    return connection[1];
  }

}

export default new UserConnectionDao();