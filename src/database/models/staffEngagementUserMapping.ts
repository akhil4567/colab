import { Sequelize, Model, DataTypes, Optional, CreationOptional, UUIDV4, EnumDataType } from 'sequelize';

export interface StaffEngagementUserMappingAttributes {
  id: string,
  staffEngagementId: string,
  userId: string,
  showCancelled?: boolean
};


export class StaffEngagementUserMapping extends Model<StaffEngagementUserMappingAttributes> {
  static associate(models: any) {
    StaffEngagementUserMapping.belongsTo(models.User, { foreignKey: 'userId' });
    StaffEngagementUserMapping.belongsTo(models.StaffEngagement, { foreignKey: 'staffEngagementId' });
  }
}

const StaffEngagementUserMappingFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof StaffEngagementUserMapping => {

  StaffEngagementUserMapping.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    staffEngagementId: dataTypes.STRING,
    userId: dataTypes.STRING,
    showCancelled: dataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'StaffEngagementUserMapping',
  });
  return StaffEngagementUserMapping;
};


export default StaffEngagementUserMappingFactory;