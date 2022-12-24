import { json } from "express";
import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");
const Sequelize = db.dbInterface.Sequelize;

class PermissionDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getPermissions(data: any) {
    const attributesExclusions = [
        "createdBy",
        "updatedBy",
        "deletedAt",
        "createdAt",
        "updatedAt",
      ];
    const permission: any = await db.dbInterface.models.Permission.findAll({
      attributes: {
        exclude: attributesExclusions,
      },
      order: [['name', 'ASC']],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0
    });

    return permission;
  }

  async getDeletedPermissions(data: any) {
    const permission: any = await db.dbInterface.models.Permission.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      paranoid: false,
    });

    return permission;
  }

  async createPermission(data: any) {
    const permission: any = await db.dbInterface.models.Permission.create(
    {
        name: data.name,
        key: data.key,
        description: data.description,
        featureId: data.featureId,
        createdBy: data.user.id,
        updatedBy: data.user.id,
    });
    log.info("Permission Created Successfully", permission);

    return permission;
  }

  async updatePermission(data: any) {
    const permission: any = await db.dbInterface.models.Permission.update(
    {
        name: data.name,
        key: data.key,
        description: data.description,
        featureId: data.featureId,
        updatedBy: data.user.id,
    },
    { where: { id: data.id }, returning: true }
    );

    log.info("Permission updated Successfully ", permission);

    return permission[1];

  }

  async deletePermission(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any = await db.dbInterface.models.Permission.update(
        {
          updatedBy: data.user.id,
        },
        {
          where: { id: data.id },
          transaction,
        }
      );

      log.info("RoleUpdate --> ", JSON.stringify(updateLog));
      let rolePermissionRes =
        await db.dbInterface.models.RolePermissionMapping.destroy({
          where: { permissionId: data.id },
          transaction,
        });
      log.info(
        "RolePermissionResponse (Destroy) --> ",
        JSON.stringify(rolePermissionRes)
      );

      const permission: any = await db.dbInterface.models.Permission.destroy({
        where: { id: data.id },
        transaction,
      });
      log.info("Permission (Destroy) --> ", JSON.stringify(permission));
      await transaction.commit();

      //log.info("Role (Destroy) --> ", JSON.stringify(role));
      return permission;
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!!", error);
      return error;
    }
  }
}

export default new PermissionDao();
