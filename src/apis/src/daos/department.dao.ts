import { json } from "express";
import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");

const Sequelize = db.dbInterface.Sequelize;

class DepartmentDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getDepartmentPublic(data: any) {
    const departments: any = await db.dbInterface.models.Department.findAll({
      include: [
        {
          model: db.dbInterface.models.Location,
          as: "locations",

          through: { attributes: [] },
        },
        {
          model: db.dbInterface.models.EngagementType,
        },
      ],
      where: { tenantId: data.tenantId },

      order: [[data.sort, data.order]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
    });

    return departments;
  }

  async getDepartment(data: any) {


    let whereOptions : any = {};

    data.search  ? (whereOptions['name'] = {[Op.iLike]:`%${data.search}%`}): null;



    const {rows , count}: any = await db.dbInterface.models.Department.findAndCountAll({
      include: [
        {
          model: db.dbInterface.models.Location,
          as: "locations",
          attributes: ["id", "name"],

          through: { attributes: [] },
        },
        {
          model: db.dbInterface.models.EngagementType,
          attributes: ["id", "name", "description"],
        },
      ],
      where: { tenantId: data.user.tenantId ,...whereOptions},

      order: [[data.sort, data.order]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      distinct:true
    });

    return {data:rows , departmentCount : count};
  }

  async getDeletedDepartment(data: any) {
    const department: any = await db.dbInterface.models.Department.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
        tenantId: data.user.tenantId,
      },
      order: [[data.sort, data.order]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      paranoid: false,
    });

    return department;
  }

  /**
   * Create department Details.
   * bulk create location Department mapping.
   * bulk create engagement type details .
   * Transaction is used any error will revert back all db operation.
   *
   * @param data
   * @returns
   */

  async createDepartment(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const Department: any = await db.dbInterface.models.Department.create(
        {
          name: data.name,
          description: data.description,
          status: data.status,
          createdBy: data.user.id,
          updatedBy: data.user.id,
          tenantId: data.user.tenantId,
        },
        transaction
      );

      let locations: any = [];
      let mappingRes: any;

      if (data.locationIds?.length) {
        data.locationIds.forEach((id: any) => {
          locations.push({
            departmentId: Department.id,
            locationId: id,
          });
        });
        log.info("Location IDs -- ", locations);

        mappingRes =
          await db.dbInterface.models.LocationDepartmentMapping.bulkCreate(
            locations,
            { transaction }
          );
      }

      log.info(
        "Location Department Mapping Response -- ",
        JSON.parse(JSON.stringify(mappingRes))
      );

      let engagementTypes: any = [];

      if (data.engagementTypes?.length) {
        data.engagementTypes.forEach((engagementType: any) => {
          engagementType["createdBy"] = data.user.id;
          engagementType["updatedBy"] = data.user.id;
          engagementType["departmentId"] = Department.id;
          engagementTypes.push({
            ...engagementType,
          });
        });

        const engagementTypeResult: any =
          await db.dbInterface.models.EngagementType.bulkCreate(
            engagementTypes,
            { transaction }
          );
        log.info(
          "Add Engagement Type Response -- ",
          JSON.parse(JSON.stringify(engagementTypeResult))
        );
      }

      await transaction.commit();
      log.info("Department Created Successfully", Department);

      return Department;
    } catch (error: any) {
      await transaction.rollback();
      log.error("Error !!!! ", error);
      throw new Error(error);
    }
  }

  /**
   * Update the department details along with Delete all the
   * existing department Location mapping and create new mapping.
   *
   * @param data
   * @returns
   */

  async updateDepartment(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();

    try {
      const Department: any = await db.dbInterface.models.Department.update(
        {
          name: data.name,
          description: data.description,
          status: data.status,
          tenantId: data.user.tenantId,
          updatedBy: data.user.id,
        },
        { where: { id: data.id }, returning: true }
      );

      let locationDepartmentRes =
        await db.dbInterface.models.LocationDepartmentMapping.destroy({
          where: { departmentId: data.id },
          transaction,
        });

      log.info(
        "LocationDepartmentResponse (Destroy) --> ",
        JSON.stringify(locationDepartmentRes)
      );

      let locations: any = [];
      let mappingRes: any;

      if (data.locationIds?.length) {
        data.locationIds.forEach((id: any) => {
          locations.push({
            departmentId: data.id,
            locationId: id,
          });
        });
        log.info("Location IDs -- ", locations);
        mappingRes =
          await db.dbInterface.models.LocationDepartmentMapping.bulkCreate(
            locations,
            { transaction }
          );
      }

      log.info(
        "Location Department Mapping Response -- ",
        JSON.stringify(mappingRes)
      );

      await transaction.commit();

      log.info("Department updated Successfully ", Department);

      return Department[1];
    } catch (error: any) {
      await transaction.rollback();
      log.error("Error !!! ", error);
      throw new Error(error);
    }
  }

  async deleteDepartment(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any = await db.dbInterface.models.Department.update(
        {
          updatedBy: data.user.id,
        },
        {
          where: { id: data.id },
          transaction,
        }
      );

      log.info("DepartmentUpdate --> ", JSON.stringify(updateLog));

      let locationDepartmentRes =
        await db.dbInterface.models.LocationDepartmentMapping.destroy({
          where: { departmentId: data.id },
          transaction,
        });
      log.info(
        "LocationDepartmentResponse (Destroy) --> ",
        JSON.stringify(locationDepartmentRes)
      );

      const department: any = await db.dbInterface.models.Department.destroy(
        {
          where: { id: data.id },
          transaction
        }
      );

      log.info("Deleted Department --> ", JSON.stringify(department));

      await transaction.commit();

      return department;
    } catch (error: any) {
      await transaction.rollback();
      log.error("Error !!!", error);
      throw new Error(error);
    }
  }
}

export default new DepartmentDao();
