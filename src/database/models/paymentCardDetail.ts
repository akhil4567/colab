import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface PaymentCardDetailAttributes {
  id?: string,
  subscriptionId?: string,
  cardNumber: string,
  cardShortDescription: string,
  cardExpiryDate: string,
};

export class PaymentCardDetail extends Model<PaymentCardDetailAttributes> {
  static associate(models: any) {
    PaymentCardDetail.belongsTo(models.Subscription, { foreignKey: 'subscriptionId' });
  }
}

const paymentCardDetailFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof PaymentCardDetail => {

  PaymentCardDetail.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    subscriptionId: dataTypes.STRING,
    cardNumber: dataTypes.STRING,
    cardShortDescription: dataTypes.STRING,
    cardExpiryDate: dataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PaymentCardDetail',
    paranoid: true
  });

  return PaymentCardDetail;
};


export default paymentCardDetailFactory;