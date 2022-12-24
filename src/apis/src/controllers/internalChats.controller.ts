import express from "express";
import InternalChatDao from "../daos/internalChat.dao";
import TenantDao from "../daos/tenant.dao";
import { log } from "../common/classes/log.class";
import { config } from "../common/config/config";
const AWS = require("aws-sdk");
AWS.config = new AWS.Config({
  accessKeyId: process.env.pinpointAccessKeyId,
  secretAccessKey: process.env.pinpointSecretAccessKey,
  region: process.env.awsRegion,
});

class InternalChatController {
  async getIndividualChats(req: express.Request, res: express.Response) {
    const result = await InternalChatDao.getIndividualChats({
      limit: req.query.limit || 20,
      offset: req.query.page || 1,
      user: req.user,

      xUserId: req.query.uId,
    });
    return result;
  }
  async getGroupChats(req: express.Request, res: express.Response) {
    const result = await InternalChatDao.getGroupChats({
      limit: req.query.limit || 20,
      offset: req.query.page || 1,
      user: req.user,
      chatName: req.query.chatName || null,
    });
    return result;
  }

  async createIndividualChat(req: express.Request, res: express.Response) {
    const result = await InternalChatDao.createIndividualChat({
      user: req.user,
      chatUserId: req.params.chatUserId,
    });
    return result;
  }

  async getChatMessagesByRoomId(req: express.Request, res: express.Response) {
    const result = await InternalChatDao.getChatMessagesById({
      user: req.user,
      chatRoomId: req.params.chatRoomId,
    });
    return result;
  }

  async createGroupChat(req: express.Request, res: express.Response) {
    const result = await InternalChatDao.createGroupChat({
      user: req.user,
      groupTitle: req.body.groupTitle,
      userIds: req.body.userIds,
    });
    return result;
  }

  async sendChatMessage(req: express.Request, res: express.Response) {
    const result = await InternalChatDao.sendChatMessage({
      user: req.user,
      message: req.body.chatMessage,
      chatRoomId: req.params.chatRoomId,
      documentLink: req.body?.documentLink || null,
    });
    return result;
  }

  async uploadProfileImage(
    req: express.Request,
    res: express.Response
    /**
     * API for uploading profile image of the Group Chat
     * We upload the image file in S3 with the provided bucket in the config file
     * In S3 the image will be present within the key (Ex. TenantName/ProfileImages/<chatRoomID>)
     * Later the uploaded image URL is saved in profileImage column of Customer table
     */
  ) {
    const file_data: any = req.file;
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    });
    const user: any = req.user;
    const chatRoomId: any = req.query.chatRoomId;

    const tenant: any = await TenantDao.getTenantDetails({
      id: user.tenantId,
    });
    const tenantName = tenant.dataValues.name;
    console.log("DATA---;;;;", file_data);
    //return tenant;
    //const tenantName = .dataValues.name;
    /**
     * Params that are passed for S3 file Upload function
     */
    config;
    const params = {
      Bucket: config.s3.uploadProfileImageBucket,
      Key: `${tenantName}/${config.s3.groupChatProfileImageDirectory}/${chatRoomId}`,
      Body: file_data.buffer,
      ACL: config.s3.uploadProfileImageACL,
      ContentType: config.s3.imageContentType,
    };

    /**
     * Uploading image into S3 bucket
     */
    const s3_upload_data: any = await new Promise((resolve) => {
      s3.upload(params, function (error: any, data: any) {
        resolve({ error, data });
      });
    });
    /**
     * Saving the uploaded image URL in profileImage column of UserMapping table
     */
    const result = InternalChatDao.uploadProfileImage({
      groupChatProfileImageURL: s3_upload_data.data.Location,
      user: req.user,
      id: chatRoomId,
    });
    return result;
  }
}

export default new InternalChatController();
