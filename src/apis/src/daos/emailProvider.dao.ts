import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");
let attributesExclusions = [
  "createdBy",
  "updatedBy",
  "deletedAt",
  "createdAt",
  "updatedAt",
  "assignedTo",
  "tenantId",
  "departmentId",
  "locationId",
  "slotId",
  "customerId",
  "engagementTypeId",
  "password",
  "lastLoggedTenantId",
  "refreshToken",
  "googleId",
  "outlookId",
];

class EmailProviderDao {
  constructor() {}

  async getAllProvider(data: any) {
    const emailProvider: any =
      await db.dbInterface.models.EmailProvider.findAll({
        where: { tenantId: data.user.tenantId, userId: data.user.id },
        attributes: {
          exclude: attributesExclusions,
        },

        order: [["name", "ASC"]],
        limit: data.limit,
        offset: data.offset > 0 ? --data.offset * data.limit : 0,
      });

    return emailProvider;
  }

  async getDeleteEmailProvider(data: any) {
    const emailProvider: any =
      await db.dbInterface.models.EmailProvider.findAll({
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
          tenantId: data.user.tenantId,
          userId: data.user.id,
        },
        order: [["name", "ASC"]],
        limit: data.limit,
        offset: data.offset > 0 ? --data.offset * data.limit : 0,
        paranoid: false,
      });

    return emailProvider;
  }

  async findEmailProvider(email: string) {
    const emailProvider: any =
      await db.dbInterface.models.EmailProvider.findOne({
        where: {
          email: email,
        },
        include: [
          {
            model: db.dbInterface.models.User,
          },
        ],
      });

    log.info(
      "GET Email Provider Response  -- ",
      JSON.parse(JSON.stringify(emailProvider))
    );

    return emailProvider;
  }

  async findEmailProviderById(id: string) {
    const emailProvider: any =
      await db.dbInterface.models.EmailProvider.findByPk(id);

    log.info(
      "GET Email Provider Response  -- ",
      JSON.parse(JSON.stringify(emailProvider))
    );

    return emailProvider;
  }

  async createEmailProvider(data: any) {
    const emailProvider: any = await db.dbInterface.models.EmailProvider.create(
      {
        email: data.email,
        status: data.status || "active",
        name: data.name,
        provider: data.provider,
        refreshToken: data.refreshToken,
      }
    );

    log.info(
      "create Email Provider Response  -- ",
      JSON.parse(JSON.stringify(emailProvider))
    );

    return emailProvider;
  }

  async updateRefreshToken(data: any) {
    const updateEmailProvider: any =
      await db.dbInterface.models.EmailProvider.update(
        { refreshToken: data.refreshToken },
        {
          where: { id: data.id },
          returning: true,
        }
      );
    log.info(
      "Update Email Provider Response  -- ",
      JSON.parse(JSON.stringify(updateEmailProvider[1]))
    );

    return updateEmailProvider[1];
  }

  async updateUserId(data: any) {
    const updateEmailProvider: any =
      await db.dbInterface.models.EmailProvider.update(
        {
          userId: data.user.id,
          tenantId: data.user.tenantId,
          updatedBy: data.user.id,
        },
        {
          where: { id: data.id },
          returning: true,
        }
      );
    log.info(
      "Update Email Provider Response  -- ",
      JSON.parse(JSON.stringify(updateEmailProvider[1]))
    );

    return updateEmailProvider[1];
  }

  async deleteEmailProvider(data: any) {
    const emailProvider: any =
      await db.dbInterface.models.EmailProvider.destroy({
        where: { id: data.id, userId: data.user.id },
        force:true,
      });

    log.info("Deleted Email Provider --> ", JSON.stringify(emailProvider));

    return emailProvider;
  }
}

export default new EmailProviderDao();
