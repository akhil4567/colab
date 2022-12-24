import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface PlanFeatureMappingAttributes {
  id: string,
  planId: string,
  featureId: string,
};

export class PlanFeatureMapping extends Model<PlanFeatureMappingAttributes> {
  static associate(models: any) {

  }
}

const planFeatureMappingFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof PlanFeatureMapping => {

  PlanFeatureMapping.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    planId: dataTypes.STRING,
    featureId: dataTypes.STRING   
  }, {
    sequelize,
    modelName: 'PlanFeatureMapping'
  });

  return PlanFeatureMapping;
};


export default planFeatureMappingFactory;