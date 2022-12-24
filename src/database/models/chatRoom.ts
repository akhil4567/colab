import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface ChatRoomAttributes {
  id?: string;
  name?: string;
  tenantId: string;
  isChannel: boolean;
  groupProfileImage?: string;
}

export class ChatRoom extends Model<ChatRoomAttributes> {
  static associate(models: any) {
    ChatRoom.belongsToMany(models.User, {
      through: "ChatRoomMappings",
      foreignKey: "chatRoomId",
      as: "users",
    });

    ChatRoom.hasMany(models.ChatRoomMapping, {
      foreignKey: "chatRoomId",
      as: "chatRoomUserMappings",
    });
    ChatRoom.hasMany(models.Message, {
      foreignKey: "chatRoomId",
      as: "messages",
    });
    ChatRoom.belongsTo(models.Tenant, { foreignKey: "tenantId", as: "tenant" });
    ChatRoom.belongsTo(models.User, { foreignKey: "createdBy" });
    ChatRoom.belongsTo(models.User, { foreignKey: "updatedBy" });
    //ChatRoom.belongsTo(models.User, { foreignKey: "createdBy" });
  }
}

const chatRoomFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof ChatRoom => {
  ChatRoom.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      name: dataTypes.STRING,
      tenantId: dataTypes.STRING,
      isChannel: dataTypes.BOOLEAN,
      groupProfileImage: dataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ChatRoom",
      paranoid: true,
    }
  );

  return ChatRoom;
};

export default chatRoomFactory;
