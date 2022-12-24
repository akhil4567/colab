import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface TokenAttributes {
  id?: string,
  tokenSecret: string,
  type: string,
  userId : string,
  expiry : string,
  createdBy?: string,
  updatedBy?: string,
  deletedAt?: string,

};





export class Token extends Model<TokenAttributes> {
  static associate(models: any) {
    Token.belongsTo(models.User, { foreignKey: 'userId',as: 'user'});
    Token.belongsTo(models.User, { foreignKey: 'createdBy' });
    Token.belongsTo(models.User, { foreignKey: 'updatedBy' });
    
}
}

const TokenFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Token => {

  Token.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tokenSecret: dataTypes.STRING,
    type:dataTypes.STRING,
    userId: dataTypes.UUID,
    expiry: dataTypes.STRING,
    createdBy: dataTypes.UUID,
    updatedBy: dataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Token',
    paranoid: true
  });

  return Token;
};

export default TokenFactory