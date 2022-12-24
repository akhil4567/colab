import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface HolidayAttributes {
  id?: string,
  tenantId?: string,
  holidayDate: Date,
  holidayName: string,
  holidayDescription: string,
  createdBy?: string,
  updatedBy?: string
};

export class Holiday extends Model<HolidayAttributes> {
  static associate(models: any) {
    Holiday.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    Holiday.belongsTo(models.User, { foreignKey: 'createdBy' });
    Holiday.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const HolidayFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Holiday => {

  Holiday.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tenantId: dataTypes.STRING,
    holidayDate: dataTypes.DATE,
    holidayName: dataTypes.STRING,
    holidayDescription: dataTypes.STRING,
    createdBy: dataTypes.STRING,
    updatedBy: dataTypes.STRING
  }, {
    sequelize,
    modelName: 'Holiday',
    paranoid: true
  });

  return Holiday;
};


export default HolidayFactory;