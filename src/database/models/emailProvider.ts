import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface emailProviderAttributes {
  id?: string;
  provider: string;
  tenantId?: string;
  userId?: string;
  name?: string;
  email: string;
  status: string;
  refreshToken: string;

  createdBy?: string;
  updatedBy?: string;

  deletedAt?: string;
}

export class EmailProvider extends Model<emailProviderAttributes> {
  static associate(models: any) {
    EmailProvider.belongsTo(models.User, { foreignKey: "createdBy" });
    EmailProvider.belongsTo(models.User, { foreignKey: "updatedBy" });
    EmailProvider.belongsTo(models.User, { foreignKey: "userId" });
    EmailProvider.belongsTo(models.Tenant, { foreignKey: "tenantId" });
  }
}

const emailProviderFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof EmailProvider => {
  EmailProvider.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      name: dataTypes.STRING,
      email: dataTypes.STRING,
      status: dataTypes.STRING,
      refreshToken: dataTypes.STRING,
      provider: dataTypes.ENUM("gmail","outlook"),

      userId: dataTypes.UUID,
      tenantId: dataTypes.UUID,
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: "EmailProvider",
      paranoid: true,
    }
  );

  return EmailProvider;
};

export default emailProviderFactory;
