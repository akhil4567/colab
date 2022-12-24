import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface PaymentTransactionAttributes {
  id?: string,
  subscriptionId?: string,
  nextBillingDate?: string,
  nextBillingPrice?: string,
  status: string,
  paymentAmount: string,
  paymentCardDetailsId: string,
  tenantId: string,
  paymentMode: string,
};

export class PaymentTransaction extends Model<PaymentTransactionAttributes> {
  static associate(models: any) {
    PaymentTransaction.belongsTo(models.Subscription, { foreignKey: 'subscriptionId' });
    PaymentTransaction.belongsTo(models.PaymentCardDetail, { foreignKey: 'paymentCardDetailsId' });
    PaymentTransaction.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
  }
}

const paymentTransactionFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof PaymentTransaction => {

  PaymentTransaction.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    subscriptionId: dataTypes.UUID,
    nextBillingDate: dataTypes.STRING,
    nextBillingPrice: dataTypes.STRING,
    status: dataTypes.STRING,
    paymentAmount: dataTypes.STRING,
    paymentCardDetailsId: dataTypes.UUID,
    tenantId: dataTypes.UUID,
    paymentMode: dataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PaymentTransaction',
    paranoid: true
  });

  return PaymentTransaction;
};


export default paymentTransactionFactory;