import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface PlanAttributes {
  id?: string,
  name: string,
  price: string,
  status: string,
  type: string,
  createdBy?: string,
  updatedBy?: string,
  deletedAt?: string,
};

export class Plan extends Model<PlanAttributes> {
  static associate(models: any) {
    Plan.belongsToMany(models.Feature, {
      through: 'PlanFeatureMappings', foreignKey: 'planId'
    });
    Plan.belongsTo(models.User, { foreignKey: 'createdBy' });
    Plan.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const planFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Plan => {

  Plan.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    name: dataTypes.STRING,
    price: dataTypes.STRING,
    status: dataTypes.STRING,
    type: dataTypes.STRING,
    createdBy: dataTypes.UUID,
    updatedBy: dataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Plan',
    paranoid: true
  });

  return Plan;
};


export default planFactory;