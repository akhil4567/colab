import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface ChatRoomMappingAttributes {
  id?: string;
  chatRoomId: string;
  userId: string;
}

export class ChatRoomMapping extends Model<ChatRoomMappingAttributes> {
  static associate(models: any) {
    ChatRoomMapping.belongsTo(models.ChatRoom, { foreignKey: "chatRoomId" });
    ChatRoomMapping.belongsTo(models.User, { foreignKey: "userId" });
  }
}

const chatRoomMappingFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof ChatRoomMapping => {
  ChatRoomMapping.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      chatRoomId: dataTypes.UUID,
      userId: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: "ChatRoomMapping",
    }
  );

  return ChatRoomMapping;
};

export default chatRoomMappingFactory;
