import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface emailTemplateAttributes {
  id?: string;
  userId: string;
  tenantId: string;
  subject: string;
  body: string;
  title: string;


  createdBy?: string;
  updatedBy?: string;

  deletedAt?: string;
}

export class EmailTemplate extends Model<emailTemplateAttributes> {
  static associate(models: any) {
    EmailTemplate.belongsTo(models.User, { foreignKey: "createdBy" });
    EmailTemplate.belongsTo(models.User, { foreignKey: "updatedBy" });
  }
}

const emailTemplateFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof EmailTemplate => {
  EmailTemplate.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      title: dataTypes.STRING,
      subject: dataTypes.STRING,
      body: dataTypes.TEXT,

      userId: dataTypes.STRING,
      tenantId: dataTypes.STRING,
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: "EmailTemplate",
      paranoid: true,
    }
  );

  return EmailTemplate;
};

export default emailTemplateFactory;
