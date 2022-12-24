import { Sequelize, Model, DataTypes, Optional, CreationOptional, UUIDV4 } from 'sequelize';

export interface EngagementTypeAttributes {
    id?: string,
    name: string,
  description: string,
  departmentId: string,
    createdBy?: string,
    updatedBy?: string,
};

export class EngagementType extends Model<EngagementTypeAttributes> {
  static associate(models: any) {
    EngagementType.belongsTo(models.Department , {foreignKey: 'departmentId'})
    EngagementType.belongsTo(models.User, { foreignKey: 'createdBy' });
    EngagementType.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const EngagementTypeFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof EngagementType => {

  EngagementType.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    name: dataTypes.STRING,
    description: dataTypes.STRING,
    departmentId: dataTypes.STRING,
    createdBy: dataTypes.STRING,
    updatedBy: dataTypes.STRING,
  }, {
    sequelize,
    modelName: 'EngagementType',
    paranoid: true
  });

  return EngagementType;
};


export default EngagementTypeFactory;