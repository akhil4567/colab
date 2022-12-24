import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface NotificationInterfaceAttributes {
  id?: string,
  tenantId?: string,
  userId?: string,
  data: object,
  type: string,
  isRead: boolean,
}

export class Notification extends Model<NotificationInterfaceAttributes> {

  static associate(models: any) {
    Notification.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
   
  }
}

const notificationFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof Notification => {
  Notification.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      tenantId: dataTypes.STRING,
      userId: dataTypes.STRING,
      data: dataTypes.JSON,
      type: dataTypes.STRING,
      isRead: dataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Notification',
     
    }
  );

  return Notification;
};

export default notificationFactory;
