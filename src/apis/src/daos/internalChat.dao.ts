import { db } from "../../../database/connection";
const Sequelize = db.dbInterface.Sequelize;
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");

/* todo: createdBy & updatedBy fields to be filled too in APIs...
 */
const attributesExclusions = [
  "createdBy",
  "updatedBy",
  "deletedAt",
  // "createdAt",
  // "updatedAt",
];

class InternalChatDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  /**
   fetch all Individual chats 
   */
  async getIndividualChats(data: any) {
    const individualChats: any = await db.dbInterface.models.ChatRoom.findAll({
      where: {
        isChannel: false,
        tenantId: data.user.tenantId
      },
      attributes: {
        exclude: attributesExclusions,
      },
      include: [
        {
          model: db.dbInterface.models.User,
          as: "users",
          attributes: ["id", "firstName", "lastName", "email", "contactNumber"],
          through: { attributes: [] },
        },
        {
          model: db.dbInterface.models.ChatRoomMapping,
          as: "chatRoomUserMappings",
          where: {
            userId: data.user.id,
          },
          attributes: [],
          // through: { attributes: [] },
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
    });

    return { individualChats, loggedInUserId: data.user.id };
  }

  async getGroupChats(data: any) {
    /**
   fetch all Groups (Channel)
   */
    let whereOptions: any = {};
    data.chatName ? (whereOptions.name = data.chatName) : null;

    const groupChats: any = await db.dbInterface.models.ChatRoom.findAll({
      where: {
        isChannel: true,
        tenantId: data.user.tenantId,


        //Search Feature
        // [Op.or]: {
        //   chatName: { [Op.iLike]: `%${data.chatName}%` },
        // },
      },

      attributes: {
        exclude: attributesExclusions,
      },
      include: [
        {

          // where: {
          //   id: data.user.id
          // },

          model: db.dbInterface.models.User,
          as: "users",
          attributes: ["id", "firstName", "lastName", "email", "contactNumber"],
          through: { attributes: [] },
        },
        {
          model: db.dbInterface.models.ChatRoomMapping,
          as: "chatRoomUserMappings",
          where: {
            userId: data.user.id,
          },
          attributes: [],
          // through: { attributes: [] },
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
    });
    return { groupChats, loggedInUserId: data.user.id };
  }

  /* todo: check for existing 1-1 chats before creating...
   */
  async createIndividualChat(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const iChat: any = await db.dbInterface.models.ChatRoom.create(
        {
          // name: "",
          tenantId: data.user.tenantId,
          isChannel: false,
        },
        { transaction }
      );
      log.info("chat created successfully", iChat);

      let users: any = [
        {
          chatRoomId: iChat.id,
          userId: data.user.id,
        },
        {
          chatRoomId: iChat.id,
          userId: data.chatUserId,
        },
      ];
      const mappingRes = await db.dbInterface.models.ChatRoomMapping.bulkCreate(
        users,
        { transaction }
      );

      log.info("user IDs -- ", users);
      log.info(
        "user ChatRoom Mapping Response  -- ",
        JSON.parse(JSON.stringify(mappingRes))
      );

      await transaction.commit();
      return { iChat, users };
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!! ", error);
      throw error;
    }
  }

  async getChatMessagesById(data: any) {
    const messages: any = await db.dbInterface.models.Message.findAll({
      where: {
        chatRoomId: data.chatRoomId,
      },
      attributes: {
        exclude: attributesExclusions,
      },
      include: [
        {
          model: db.dbInterface.models.User,
          as: "sender",
          attributes: ["id", "firstName", "lastName", "email", "contactNumber"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
    });

    return messages;
  }

  async createGroupChat(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const gChat: any = await db.dbInterface.models.ChatRoom.create(
        {
          name: data.groupTitle,
          tenantId: data.user.tenantId,
          isChannel: true,
        },
        { transaction }
      );
      log.info("Group chat created successfully! ", gChat);

      let users: any = [
        {
          chatRoomId: gChat.id,
          userId: data.user.id,
        },
      ];
      let mappingRes: any;

      if (data.userIds?.length) {
        const uniqueUserIds = [...new Set(data.userIds)];

        const index = uniqueUserIds.indexOf(data.user.id);
        if (index > -1) {
          uniqueUserIds.splice(index, 1);
        }

        uniqueUserIds.forEach((id: any) => {
          users.push({
            chatRoomId: gChat.id,
            userId: id,
          });
        });
      }
      mappingRes = await db.dbInterface.models.ChatRoomMapping.bulkCreate(
        users,
        { transaction }
      );

      log.info("user IDs -- ", users);
      log.info(
        "user ChatRoom Mapping Response  -- ",
        JSON.parse(JSON.stringify(mappingRes))
      );

      await transaction.commit();
      return gChat;
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!! ", error);
      throw error;
    }
  }

  async sendChatMessage(data: any) {
    const chatMessage: any = await db.dbInterface.models.Message.create({
      chatRoomId: data.chatRoomId,
      sentBy: data.user.id,
      message: data.message,
      documentLink: data.documentLink,
    });
    log.info("chat message sent! --> ", chatMessage);

    return chatMessage;
  }

  async uploadProfileImage(data: any) {
    log.info("DATA====---->>>>", data);
    const chatRoom: any = await db.dbInterface.models.ChatRoom.update(
      {
        groupProfileImage: data.groupChatProfileImageURL,
      },
      {
        where: { id: data.id },

        returning: true,
      }
    );

    return chatRoom[1];
  }
}

/**
Add people to existing group chat
*/

export default new InternalChatDao();
