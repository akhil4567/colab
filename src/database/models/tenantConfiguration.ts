import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface TenantConfigurationAttributes {
  id?: string,
  tenantId?: string,
  publicDescription?: Text,
  minutesBeforeBookingStops?: number,
  confirmationEmailText?: Text,
  engagementEmailFooter?: Text,
  enableSmsReminder?: boolean,
  enableEmailReminder?: boolean,
  smsReminderTime?: number,
  emailReminderTime?: number,
  logo?: string,
  reminderEmailText?: Text,
  cancellationEmailText?: Text,
  rescheduleEmailText?: Text,
  enablePublicBooking?: boolean,
  bccEmails?: Array<string>,
  createdBy?: string,
  updatedBy?: string,
  deletedAt?: string,
}

export class TenantConfiguration extends Model<TenantConfigurationAttributes> {

  static associate(models: any) {
    TenantConfiguration.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    TenantConfiguration.belongsTo(models.User, { foreignKey: 'createdBy' });
    TenantConfiguration.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const tenantConfigurationFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof TenantConfiguration => {
  TenantConfiguration.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      tenantId: dataTypes.STRING,
      publicDescription: dataTypes.TEXT,
      minutesBeforeBookingStops: dataTypes.NUMBER,
      confirmationEmailText: dataTypes.TEXT,
      engagementEmailFooter: dataTypes.TEXT,
      enableSmsReminder: dataTypes.BOOLEAN,
      enableEmailReminder: dataTypes.BOOLEAN,
      smsReminderTime: dataTypes.INTEGER,
      emailReminderTime: dataTypes.INTEGER,
      logo: dataTypes.STRING,
      reminderEmailText: dataTypes.TEXT,
      cancellationEmailText: dataTypes.TEXT,
      rescheduleEmailText: dataTypes.TEXT,
      enablePublicBooking: dataTypes.BOOLEAN,
      bccEmails: dataTypes.ARRAY(dataTypes.STRING),
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'TenantConfiguration',
      paranoid: true
    }
  );

  return TenantConfiguration;
};

export default tenantConfigurationFactory;
