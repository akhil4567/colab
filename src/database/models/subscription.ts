import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface SubscriptionAttributes {
  id?: string,
  tenantId: string,
  planId: string,
  recurringPaymentId?: string,
  status: string,
  trialStartDate: string,
  trialEndDate: string,
  subscribeAfterTrial: boolean,
  dateSubscribed: string,
  dateUnsubscribed: string,
  paymentType: string,
  createdBy?: string,
  updatedBy?: string,
  deletedAt?: string,
};

export class Subscription extends Model<SubscriptionAttributes> {
  static associate(models: any) {
    Subscription.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    Subscription.belongsTo(models.Plan, { foreignKey: 'planId' });
  }
}

const subscriptionFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Subscription => {

  Subscription.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tenantId: dataTypes.STRING,
    planId: dataTypes.STRING,
    recurringPaymentId: dataTypes.STRING,
    status: dataTypes.STRING,
    trialStartDate: dataTypes.DATE,
    trialEndDate: dataTypes.DATE,
    subscribeAfterTrial: dataTypes.BOOLEAN,
    dateSubscribed: dataTypes.DATE,
    dateUnsubscribed: dataTypes.DATE,
    paymentType: dataTypes.STRING,
    createdBy: dataTypes.STRING,
    updatedBy: dataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Subscription',
    paranoid: true
  });

  return Subscription;
};


export default subscriptionFactory;