import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface FeatureAttributes {
  id?: string,
  name: string,
  description: string,
  createdBy?: string,
  updatedBy?: string,
  deletedAt?: string,
};

export class Feature extends Model<FeatureAttributes> {
  static associate(models: any) {
    Feature.belongsToMany(models.Plan, {
      through: "PlanFeatureMappings",
      foreignKey: "featureId",
    });
    Feature.hasMany(models.Permission, { foreignKey: 'featureId'});
    Feature.belongsTo(models.User, { foreignKey: 'createdBy' });
    Feature.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const featureFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Feature => {

  Feature.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    name: dataTypes.STRING,
    description: dataTypes.STRING,
    createdBy: dataTypes.UUID,
    updatedBy: dataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Feature',
    paranoid: true
  });

  return Feature;
};


export default featureFactory;