import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface PlanHistoryAttributes {
  id?: string,
  subscriptionId?: string,
  planId?: string,
  startDate: string,
  endDate: string,
};

export class PlanHistory extends Model<PlanHistoryAttributes> {
  static associate(models: any) {
    PlanHistory.belongsTo(models.Subscription, { foreignKey: 'subscriptionId' });
    PlanHistory.belongsTo(models.Plan, { foreignKey: 'planId' });
  }
}

const planHistoryFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof PlanHistory => {

  PlanHistory.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    subscriptionId: dataTypes.STRING,
    planId: dataTypes.STRING,
    startDate: dataTypes.DATE,
    endDate: dataTypes.DATE,
  }, {
    sequelize,
    modelName: 'PlanHistory',
    paranoid: true
  });

  return PlanHistory;
};


export default planHistoryFactory;