import { db } from "../../../database/connection";
const { Op } = require("sequelize");
import { log } from "../common/classes/log.class";
const Sequelize = db.dbInterface.Sequelize;

class TenantConfigDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getTenantConfig(data: any) {
    const attributesExclusions = [
      "createdBy",
      "updatedBy",
      "deletedAt",
      "createdAt",
      "updatedAt",
    ];
    const tenantConfig: any =
      await db.dbInterface.models.TenantConfiguration.findOne({
        attributes: {
          exclude: attributesExclusions,
        },
        where: {
          tenantId: data.user.tenantId,
        },
        include: [
          {
            model: db.dbInterface.models.Tenant,
            attributes: {
              exclude: attributesExclusions,
            },
          },
        ],
      });

    return tenantConfig;
  }

  async getTenantConfigPublic(data: any) {
    const attributesExclusions = [
      "createdBy",
      "updatedBy",
      "deletedAt",
      "createdAt",
      "updatedAt",
    ];
    const tenantConfig: any =
      await db.dbInterface.models.TenantConfiguration.findOne({
        attributes: {
          exclude: attributesExclusions,
        },
        where: {
          tenantId: data.id,
        },
        include: [
          {
            model: db.dbInterface.models.Tenant,
            attributes: {
              exclude: attributesExclusions,
            },
          },
        ],
      });
   
    return tenantConfig;
  }

  async getDeletedTenantConfigs(data: any) {
    const tenantConfigs: any =
      await db.dbInterface.models.TenantConfiguration.findAll({
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
        },
        paranoid: false,
      });

    return tenantConfigs;
  }

  async createTenantConfig(data: any) {
    const tenantConfig: any =
      await db.dbInterface.models.TenantConfiguration.create({
        tenantId: data.tenantId,
        publicDescription: data.publicDescription,
        confirmationEmailText: data.confirmationEmailText,
        minutesBeforeBookingStops: data.minutesBeforeBookingStops,
        enableSmsReminder: data.enableSmsReminder,
        engagementEmailFooter: data.engagementEmailFooter,
        smsReminderTime: data.smsReminderTime,
        emailReminderTime: data.emailReminderTime,
        logo: data.logoURL,
        reminderEmailText: data.reminderEmailText,
        cancellationEmailText: data.cancellationEmailText,
        rescheduleEmailText: data.rescheduleEmailText,
        enablePublicBooking: data.enablePublicBooking,
        bccEmails: data.bccEmails,
        enableEmailReminder: data.enableEmailReminder,
        createdBy: data.user.id,
        updatedBy: data.user.id,
      });

    return tenantConfig;
  }

  async updateTenantConfig(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const tenantConfig: any =
        await db.dbInterface.models.TenantConfiguration.update(
          {
            publicDescription: data.publicDescription,
            minutesBeforeBookingStops: data.minutesBeforeBookingStops,
            confirmationEmailText: data.confirmationEmailText,
            engagementEmailFooter: data.engagementEmailFooter,
            enableSmsReminder: data.enableSmsReminder,
            enableEmailReminder: data.enableEmailReminder,
            smsReminderTime: data.smsReminderTime,
            emailReminderTime: data.emailReminderTime,
            logo: data.logoURL,
            reminderEmailText: data.reminderEmailText,
            cancellationEmailText: data.cancellationEmailText,
            rescheduleEmailText: data.rescheduleEmailText,
            enablePublicBooking: data.enablePublicBooking,
            bccEmails: data.bccEmails,
            updatedBy: data.user.id,
          },
          {
            where: { tenantId: data.tenantId },
            returning: true,
            transaction,
          }
        );

      const tenant: any = await db.dbInterface.models.Tenant.update(
        {
          name: data.title,
          updatedBy: data.user.id,
        },
        { where: { id: data.tenantId }, returning: true, transaction }
      );
      log.info("Tenant updated successfully", tenant);
      await transaction.commit();

      return tenantConfig[1];
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!!", error);
      return error;
    }
  }

  async deleteTenantConfig(data: any) {
    const tenantConfig: any =
      await db.dbInterface.models.TenantConfiguration.destroy({
        where: { tenantId: data.tenantId },
      });

    return tenantConfig[1];
  }

  async findOneTenantConfig(tenantId: any) {
    const tenantConfig: any =
      await db.dbInterface.models.TenantConfiguration.findOne({
        include: [
          {
            model: db.dbInterface.models.Tenant,
          },
        ],

        where: {
          tenantId: tenantId,
        },
      });
    return tenantConfig;
  }
}

export default new TenantConfigDao();
