import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface smsTemplateAttributes {
  id?: string;
  userId: string;
  tenantId: string;

  body: string;
  title: string;
  

  createdBy?: string;
  updatedBy?: string;

  deletedAt?: string;
}

export class SmsTemplate extends Model<smsTemplateAttributes> {
  static associate(models: any) {
    SmsTemplate.belongsTo(models.User, { foreignKey: "createdBy" });
    SmsTemplate.belongsTo(models.User, { foreignKey: "updatedBy" });
  }
}

const smsTemplateFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof SmsTemplate => {
  SmsTemplate.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      title: dataTypes.STRING,
   
      body: dataTypes.TEXT,
    
      userId: dataTypes.STRING,
      tenantId: dataTypes.STRING,
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: "SmsTemplate",
      paranoid: true,
    }
  );

  return SmsTemplate;
};

export default smsTemplateFactory;
