import moment from "moment";
import { use } from "passport";
import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
import { config } from "../common/config/config";
const Sequelize = db.dbInterface.Sequelize;

class UserMappingDao {
  constructor() {}

  async getOneUserMapping(id: string) {
    const userMapping: any = await db.dbInterface.models.UserMapping.findByPk(
      id
    );

    return userMapping;
  }

  async createUserMapping(data: any) {
    const userMapping: any = await db.dbInterface.models.UserMapping.create({
      userId: data.userId,
      tenantId: data.tenantId,
      roleId: data.roleId,
      status: data.status || "active",
      inviteStatus: "pending",
      inviteExpiry: moment().add(config.inviteExpiry, "days").utc().format(),
    });

    return userMapping;
  }

  async updateUserMapping(data: any) {
    const mappingRes: any = await db.dbInterface.models.UserMapping.update(
      { inviteStatus: data.inviteStatus },
      {
        where: { id: data.userMappingId, userId: data.user.id },
        returning: true,
      }
    );
    log.info(
      "Update User Mapping Response  -- ",
      JSON.parse(JSON.stringify(mappingRes[1]))
    );

    return mappingRes[1];
  }
}

export default new UserMappingDao();
