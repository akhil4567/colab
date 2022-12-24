import { info } from "console";
import { any } from "joi";
import { db } from "../../../database/connection";
const { Op } = require("sequelize");
import { log } from "../common/classes/log.class";
import { roleValidation } from "../validators";
import { EDIT_TENANT_PERMISSION } from "../common/config/constant";
const Sequelize = db.dbInterface.Sequelize;

class TenantDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getTenants(data: any) {
    const attributesExclusions = [
      "createdBy",
      "updatedBy",
      "deletedAt",
      "createdAt",
      "updatedAt",
    ];
    const {rows,count}: any = await db.dbInterface.models.Tenant.findAndCountAll({
      include: [
        {
          model: db.dbInterface.models.TenantConfiguration,
          attributes: {
            exclude: attributesExclusions,
          },
        },
        {
          model: db.dbInterface.models.Location,
          attributes: {
            exclude: attributesExclusions,
          },
        },
        {
          model: db.dbInterface.models.Department,
          attributes: {
            exclude: attributesExclusions,
          },
        },
        {
          model: db.dbInterface.models.UserMapping,
          attributes: {
            exclude: attributesExclusions,
          },
        },
      ],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      order: [['updatedAt', 'DESC']],
      distinct: true,
    });

    return {data: rows, tenantsCount: count};
  }

  // //to fetch single tenant details based on id
  async getTenantDetails(data: any) {
    const tenant: any = await db.dbInterface.models.Tenant.findOne({
      where: { id: data.id },
      attributes: ["name"],
    });

    return tenant;
  }

  async getTenant(data: any) {
    const attributesExclusions = [
      "createdBy",
      "updatedBy",
      "deletedAt",
      "createdAt",
      "updatedAt",
    ];
    const tenant: any = await db.dbInterface.models.Tenant.findOne({
      where: { id: data.user.tenantId },
      attributes: {
        exclude: attributesExclusions,
      },
      include: [
        {
          model: db.dbInterface.models.TenantConfiguration,
          attributes: {
            exclude: attributesExclusions,
          },
        },
      ],
      order: [["name", "ASC"]],
    });

    return tenant;
  }

  async getDeletedTenants(data: any) {
    const tenant: any = await db.dbInterface.models.Tenant.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      paranoid: false,
    });

    return tenant;
  }

  async createTenant(data: any) {
    const tenant: any = await db.dbInterface.models.Tenant.create({
      name: data.name,
      contactName: data.contactName,
      email: data.email,
      contactNumber: data.contactNumber,
      status: data.status,
      parentTenantId: data.parentTenantId,
      planId: data.planId,
      type: data.type,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode,
      createdBy: data.user.id,
      updatedBy: data.user.id,
    });

    return tenant;
  }

  async onboardingTenant(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const tenant: any = await db.dbInterface.models.Tenant.create(
        {
          name: data.name,
          status: data.status,
          type: data.type,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          street: data.street,
          state: data.state,
          city: data.city,
          country: data.country,
          zipCode: data.zipCode,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        },
        { transaction }
      );

      const role: any = await db.dbInterface.models.Role.create(
        {
          roleName: "Admin",
          description: "Admin access",
          tenantId: tenant.id,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        }, {transaction}
      );
      log.info("User Role created successfully", role);

      const rolePermissionMapping =  await db.dbInterface.models.RolePermissionMapping.create(
        {
          roleId: role.dataValues.id,
          permissionId: EDIT_TENANT_PERMISSION,
        }, {transaction}
      );
      log.info("Role permission mapping created successfully", rolePermissionMapping);

      const userMapping: any = await db.dbInterface.models.UserMapping.create(
        {
          userId: data.user.id,
          tenantId: tenant.id,
          status: "active",
          roleId: role.id,
        },
        { transaction }
      );
      log.info("User Mapping created successfully", userMapping);

      const user: any = await db.dbInterface.models.User.update(
        {
          lastLoggedTenantId: tenant.id,
          updatedBy: data.user.id,
        },
        { where: { id: data.user.id }, transaction, returning: true }
      );
      log.info("User updated successfully", user);

      await transaction.commit();
      log.info("Tenant onboarded successfully", tenant);
      return tenant;
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!!! ", error);
      return error;
    }
  }

  async updateTenant(data: any) {
    {
      const transaction = await db.dbInterface.sequelize.transaction();
      try {
        const tenant: any = await db.dbInterface.models.Tenant.update(
          {
            name: data.name,
            contactName: data.contactName,
            email: data.email,
            contactNumber: data.contactNumber,
            status: data.status,
            parentTenantId: data.parentTenantId,
            planId: data.planId,
            type: data.type,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            zipCode: data.zipCode,
            updatedBy: data.user.id,
          },
          { where: { id: data.id }, returning: true, transaction }
        );

        let roleId = "";
        data.user.UserMappings.forEach((ele: any) => {
          if (ele.tenantId === data.id) {
            //<--- checks if tenantId from UserMappings is equals to data.id user
            roleId = ele.roleId; //<--- Assigns roleId of that tenant
          }
        });
        if (data.planId){
          const plansFeatures: any = await db.dbInterface.models.Plan.findOne({
            where: {
              id: data.planId,
            },

            include: [
              {
                model: db.dbInterface.models.Feature,

                include: [
                  {
                    model: db.dbInterface.models.Permission,
                  },
                ],
              },
            ],
            transaction: transaction,
          });

          let permissions: any = [];
          let mappingRes: any;

          if (
            plansFeatures.Features?.length &&
            plansFeatures.Features[0].Permissions?.length
          ) {
            plansFeatures.Features.forEach((featureObj: any) => {
              featureObj.Permissions.forEach((permissionObj: any) => {
                permissions.push({
                  roleId: roleId || data.user.dataValues.roleId, //<-- 2 ways to get roleId
                  permissionId: permissionObj.id,
                });
              });
            });

            mappingRes =
              await db.dbInterface.models.RolePermissionMapping.bulkCreate(
                permissions,
                { transaction }
              );
          }
          log.info(
            "Role Permission Mapping Response  -- ",
            JSON.stringify(mappingRes)
          );
        }
        await transaction.commit();
        log.info("Tenant Updated Successfully", tenant);
        return tenant[1];
      } catch (error) {
        await transaction.rollback();
        log.info("Error !!!", error);
        return error;
      }
    }
  }

  async deleteTenant(data: any) {
    const tenant: any = await db.dbInterface.models.Tenant.destroy({
      where: { id: data.id },
    });

    return tenant[1];
  }
}

export default new TenantDao();
