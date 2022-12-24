import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const Sequelize = db.dbInterface.Sequelize;

class EngagementTypeDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getEngagementTypes(data: any) {
    const engagementTypes: any =
      await db.dbInterface.models.EngagementType.findAll({
        where: {
          departmentId: data.departmentId,
        },
      });

    return engagementTypes;
  }

  async createEngagementType(data: any) {
    const engagementType: any =
      await db.dbInterface.models.EngagementType.create({
        name: data.name,
      description: data.description,
        departmentId: data.departmentId,
        createdBy: data.user.id,
        updatedBy: data.user.id,
      });

    return engagementType;
  }

  async updateEngagementType(data: any) {
    const engagementType: any =
      await db.dbInterface.models.EngagementType.update(
        {
          name: data.name,
          description: data.description,
          departmentId: data.departmentId,
          updatedBy: data["user"].id,
        },
        { where: { id: data.id }, returning: true }
      );

    return engagementType;
  }

  async deleteEngagementType(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any = await db.dbInterface.models.EngagementType.update(
        {
          updatedBy: data.user.id,
        },
        {
          where: { id: data.engagementTypeId },
          transaction,
        }
      );

      log.info("EngagementType Update --> ", JSON.stringify(updateLog));

      const result: any = await db.dbInterface.models.EngagementType.destroy({
        where: {
          id: data.engagementTypeId,
        },
        transaction,
      });
      log.info("EngagementType Deleted successfully --> ", result.dataValues);
      await transaction.commit();
      return result;
    } catch (error: any) {
      await transaction.rollback();
      log.error("Error !!!", error);
      throw new Error(error);
    }
  }
}

export default new EngagementTypeDao();
