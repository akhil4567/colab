import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface UserConnectionInterfaceAttributes {
  id?: string,
  userId: string,
  connectionId:string,
  deletedAt?: string,
  tenantId?:string
}

export class UserConnection extends Model<UserConnectionInterfaceAttributes> {

  static associate(models: any) {
    UserConnection.belongsTo(models.User, { foreignKey: 'userId' });
   
  }
}

const userConnectionFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof UserConnection => {
  UserConnection.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      userId: dataTypes.STRING,
      connectionId:dataTypes.STRING,
      deletedAt: dataTypes.STRING,
      tenantId: dataTypes.STRING
    },
    {
      sequelize,
      modelName: 'UserConnection',
      paranoid: true
    }
  );

  return UserConnection;
};

export default userConnectionFactory;
