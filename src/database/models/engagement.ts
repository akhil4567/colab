import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface EngagementAttributes {
    id?: string,
    description: string,
    engagementDuration: number,
    engagementDateTime: Date,
    slotId: string,
    customerId: string,
    assignedTo: string,
    engagementTypeId?: string,
    tenantId?: string,
    departmentId?: string,
    locationId?: string,
    createdBy?: string,
    updatedBy?: string,
    videoProvider?: string,
    videolocation?:string,
    emailReminderTime?: Date,
    documentId?: string,
    calendarEventId?:string,
    calendarProvider?:string,
};

export class Engagement extends Model<EngagementAttributes> {
  static associate(models: any) {
    // Engagement.belongsTo(models.Department , {foreignKey: 'departmentId'})
    Engagement.belongsTo(models.Slot, { foreignKey: 'slotId', as: 'slotDetails' });
    Engagement.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignedUser' });
    Engagement.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
    Engagement.belongsTo(models.EngagementType, { foreignKey: 'engagementTypeId', as: 'engagementType' });
    Engagement.belongsTo(models.Tenant, { foreignKey: 'tenantId', as: 'tenant' });
    Engagement.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
    Engagement.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
    Engagement.belongsTo(models.Document, { foreignKey: 'documentId' });
    Engagement.belongsTo(models.User, { foreignKey: 'createdBy' });
    Engagement.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const EngagementFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Engagement => {

  Engagement.init({
    id: {
      type: dataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    slotId: dataTypes.STRING,
    customerId: dataTypes.STRING,
    assignedTo: dataTypes.STRING,
    description: dataTypes.STRING,
    engagementDuration: dataTypes.INTEGER,
    engagementDateTime: dataTypes.DATE,
    engagementTypeId: dataTypes.STRING,
    tenantId: dataTypes.STRING,
    departmentId: dataTypes.STRING,
    locationId: dataTypes.STRING,
    createdBy: dataTypes.STRING,
    updatedBy: dataTypes.STRING,
    videoProvider: dataTypes.STRING,
    videolocation:dataTypes.STRING,
    emailReminderTime: dataTypes.DATE,
    documentId: dataTypes.UUID,
    calendarEventId: dataTypes.STRING,
    calendarProvider: dataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Engagement',
    paranoid: true
  });

  return Engagement;
};


export default EngagementFactory;