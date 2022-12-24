import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface MessagesAttributes {
  id?: string;
  chatRoomId: string;
  sentBy: string;
  message: string;
  isDeleted?: boolean;
  documentLink?: string;
}

export class Message extends Model<MessagesAttributes> {
  static associate(models: any) {
    Message.belongsTo(models.User, { foreignKey: "sentBy", as: "sender" });
    Message.belongsTo(models.ChatRoom, { foreignKey: "chatRoomId" });
    Message.belongsTo(models.User, { foreignKey: "createdBy" });
    Message.belongsTo(models.User, { foreignKey: "updatedBy" });
  }
}

const messageFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof Message => {
  Message.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      chatRoomId: dataTypes.UUID,
      sentBy: dataTypes.UUID,
      message: dataTypes.STRING(1000),
      isDeleted: dataTypes.BOOLEAN,
      documentLink: dataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
      paranoid: true,
    }
  );

  return Message;
};

export default messageFactory;
