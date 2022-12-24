import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface SlotAttributes {
  id?: string,
  tenantId?: string,
  departmentId?: string,
  locationId?: string,
  engagementTypeId?: string,
  weekDaysCron: string,
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  slotDuration: number,
  assignedTo?: string,
  slotTimeZone: string,
  slotDescription?: string,
  createdBy?: string,
  updatedBy?: string,
  meetingType: string
};

export class Slot extends Model<SlotAttributes> {
  static associate(models: any) {
    Slot.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assigneeDetails' });
    Slot.hasMany(models.SlotException, { foreignKey: 'slotId', as: 'exceptions' });
    Slot.hasMany(models.Engagement, { foreignKey: 'slotId', as: 'engagements' });
    Slot.belongsTo(models.EngagementType, { foreignKey: 'engagementTypeId', as: 'engagementType' });
    Slot.belongsTo(models.Tenant, { foreignKey: 'tenantId', as: 'tenant' });
    Slot.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
    Slot.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
    Slot.belongsTo(models.User, { foreignKey: 'createdBy' ,as:"creater"});
    Slot.belongsTo(models.User, { foreignKey: 'updatedBy', as:"updater" });
  }
}

const SlotFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Slot => {

  Slot.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tenantId: dataTypes.STRING,
    departmentId: dataTypes.STRING,
    locationId: dataTypes.STRING,
    engagementTypeId: dataTypes.STRING,
    weekDaysCron: dataTypes.STRING,
    startDate: dataTypes.DATE,
    endDate: dataTypes.DATE,
    startTime: dataTypes.TIME,
    endTime: dataTypes.TIME,
    slotDuration: dataTypes.NUMBER,
    assignedTo: dataTypes.STRING,
    slotTimeZone: dataTypes.STRING,
    slotDescription: dataTypes.STRING,
    createdBy: dataTypes.STRING,
    updatedBy: dataTypes.STRING,
    meetingType: dataTypes.STRING
  }, {
    sequelize,
    modelName: 'Slot',
    paranoid: true
  });

  return Slot;
};


export default SlotFactory;