import express from "express";
import moment from "moment";
import {config} from "../common/config/config"
import {
  UserMappingAttributes,
} from "../../../database/models/userMapping";
import {
  EmailComposer,
} from "../common/classes/email-composer.class";
import { token } from "../common/classes/token.class";
import sendEmail from "../common/services/email";
import UserDao from "../daos/user.dao";
import TenantDao from "../daos/tenant.dao";
import userMappingDao from "../daos/userMapping.dao";
const AWS = require("aws-sdk");
AWS.config = new AWS.Config({
  accessKeyId: process.env.pinpointAccessKeyId,
  secretAccessKey: process.env.pinpointSecretAccessKey,
  region: process.env.awsRegion,
});

class UserController {
  async getAllUsers(req: express.Request, res: express.Response) {
    const result = await UserDao.getUsers({
      order: req.query.order || 'ASC',
      sort: req.query.sort || 'firstName',
      search: req.query.search || null,
      limit: req.query.limit || 20,
      offset: req.query.page || 1,
      user: req.user,
    });
    return result;
  }

  async getDeletedUsers(req: express.Request, res: express.Response) {
    const result = await UserDao.getDeletedUsers({
      limit: req.query.limit || 20,
      offset: req.query.page || 1,
    });
    return result;
  }

  async getOneUser(req: express.Request, res: express.Response) {
    const result = await UserDao.getOneUser({
      user: req.user,
    });
    return result;
  }

  /**
   * Invite Confirm
   * After Sending invite to the user, this API allow them 
   * to accept or reject the Invitation.
   * 
   *
   * @param req
   * @param res
   * @returns
   */

  async inviteConfirm(req: express.Request, res: express.Response) {
    /**
     * Check whether the userMapping exist.
     */
    const userMapping: UserMappingAttributes = await userMappingDao.getOneUserMapping(req.body.userMappingId);

    if (userMapping) {
      /**
       * If exist check for necessary condition to accept the invite.
       * status should be pending and inviteExpiry should be valid.
       */
      if (
        userMapping.inviteStatus !== "pending" ||
        userMapping.inviteExpiry! > moment().utc().format()
      ) {
        throw new Error("Invitation Expired or Not Valid");
      }
    }

    /**
     * All condition Met make accept or reject the invite.
     */

    const updateUserMapping: UserMappingAttributes =
      await userMappingDao.updateUserMapping({
        ...req.body,
        user: req.user,
      });

    /**
     * After invite accept change the lastLoggedIn tenantId.
     *
     */
    if (req.body.inviteStatus === "accept") {
      const changeTenant: any = await UserDao.changeTenant({
        user: req.user,
        tenantId: userMapping.tenantId,
      });
    }

    return updateUserMapping;
  }

  async createUser(req: express.Request, res: express.Response) {
    const user: any = req.user;

    //TODO check user exist for email and tenantID

    /**
     * find if any user already created in the system.
     */
    const findUser: any = await UserDao.findOneUser(req.body.email);
    if (findUser) {
      /**
       * check this user already linked with current Tenant.
       */
      let tenantFound = findUser?.UserMappings.some(
        (el: any) => el.tenantId === user.tenantId
      );

      if (tenantFound) {
        //TODO future if we allow multiple invite share if rejected handle here.
        throw new Error("User Already Exist Under this Tenant");
      } else {
        /**
         *  create a UserMapping with the tenantId 
         */

        let userMapping = await userMappingDao.createUserMapping({
          ...req.body,
          userId: findUser.id,
          tenantId: user.tenantId,
        });

        /**
         *  Send an Email Invitation to the current User
         *
         */

        await this.sendInvitationEmail(findUser, user);

        return { message: "Invitation Send Successfully." };
      }
    } else {
      const result = await UserDao.createUser({
        ...req.body,
        user,
      });

      /**
       *  Send invitation Email to the new User
       */

      await this.sendInvitationEmail(result, user);
      return result;
    }
  }
/**
 * Change the Active tenant for a user.
 * @param req 
 * @param res 
 * @returns 
 */
  async changeTenant(req: express.Request, res: express.Response) {
    const result = await UserDao.changeTenant({
      ...req.body,
      user: req.user,
    });
    return result;
  }
  /**
   * 
   * @param req 
   * @param res 
   * @returns The Details of the invite User and wether he is authenticated
   * with the app.
   * isAuth -> signifies whether the user Authenticated the app in any
   * acceptable way that is Password, gmail/outlook oAuth.
   * 
   */

  async getInviteUser(req: express.Request, res: express.Response) {
    let user: any = req.user;
    
    

    let isAuth = true;
    if (
      user.password === null &&
      user.googleId === null &&
      user.outlookId === null
    ) {
      isAuth = false;
    }

    user = await UserDao.getOneUser({user})

   
    /**
     *  Get the email provider.
     */
    let provider = user.email
      .substring(user.email.lastIndexOf("@") + 1)
      .split(".")[0];

    return { user: user, isAuth, provider };
  }

  async updateUser(req: express.Request, res: express.Response) {
    const result = await UserDao.updateUser({
      id: req.params.id,
      ...req.body,
      user: req.user,
    });
    return result;
  }

  async uploadProfileImage(req: express.Request, res: express.Response) 
    /**
     * API for uploading profile image of the user
     * We upload the image file in S3 with the provided bucket in the config file
     * In S3 the image will be present within the key (Ex. TenantName/ProfileImages/<UserID>)
     * Later the uploaded image URL is saved in profileImage column of UserMapping table
     */
  {
    const file_data: any = req.file;
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    });
    const user: any = req.user
    const tenant: any = await TenantDao.getTenantDetails({
      id: user.tenantId
    });
    const tenantName = tenant.dataValues.name
    /**
     * Params that are passed for S3 file Upload function
     */
    const params = {
      Bucket: config.s3.uploadProfileImageBucket,
      Key:`${tenantName}/${config.s3.userProfileImageDirectory}/${user.dataValues.id}`,
      Body:file_data.buffer,
      ACL:config.s3.uploadProfileImageACL,
      ContentType:config.s3.imageContentType
    };

    /**
     * Uploading image into S3 bucket
     */
    const s3_upload_data: any =  await new Promise((resolve) => {
      s3.upload(params, function (error: any, data: any) {
        resolve({ error, data });
      });
    });
    /**
     * Saving the uploaded image URL in profileImage column of UserMapping table
     */
    const result =  UserDao.uploadProfileImage({
        profileImageURL: s3_upload_data.data.Location,
        user: req.user,
    });
    return result;
  }

  // async deleteUser(req: express.Request, res: express.Response) {
  //   const result = await UserDao.deleteUser({
  //     id: req.params.id,
  //     user: req.user,
  //     ...req.body,
  //   });
  //   return result;
  // }

  /**
   * Sent Email invite to the new User.
   *
   * @param result
   * @param user
   * @returns
   */

  async sendInvitationEmail(result: any, user: any) {
    /**
     *  create a token with userId and TenantId.
     *
     */

    let inviteToken: string = await token.generateInviteJwtToken(
      result.id,
      user.tenantId
    );

    /**
     *  Invitation Link to check the authenticity of Link
     *  Added a token for validation
     */

    let invitationLink: string = `${config.clientUrl}/auth/invite/?inviteToken=${inviteToken}`;

    /**
     *  Create Join Engage Email with all necessary Data.
     */

    const emailBody: string = await EmailComposer.composeJoinReframeEmail({
      userName: result.firstName,
      inviteLink: invitationLink,
      invitationValidity: config.inviteExpiry!,
    });

    /**
     *  communication api expect customer Details in Array
     */

    let customers = [
      {
        customerEmail: result.email,
        customerName: result.firstName,
        customerId: result.id,
      },
    ];

    let sendEmailResult = await sendEmail({
      customers,
      emailSubject: "Engage Invitation",
      emailBody,
      clientUserId: user.id,
      tenantId: user.tenantId,
    });

    return sendEmailResult;
  }
}

export default new UserController();
