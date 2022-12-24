import express from "express";
import bcrypt from "bcrypt";
import { config } from "../common/config/config";
import UserDao from "../daos/user.dao";
import { v4 as uuidv4 } from "uuid";
import { log } from "../common/classes/log.class";
import moment from "moment";
import { token } from "../common/classes/token.class";
import TokenDao from "../daos/token.dao";
import { EmailComposer } from "../common/classes/email-composer.class";
import sendEmail from "../common/services/email";

class AuthController {
  async signup(req: express.Request, res: express.Response) {
    const saltRounds: number = parseInt(config.saltRounds!);
    let { email, password } = req.body;

    try {
      let user = await UserDao.findOneUser(email);
      //TODO add check and if user exist check the edge case.

      if (user) {
        const responseMessage = "Email is already Exist";
        return res
          .status(402)
          .json({ statusCode: 402, message: responseMessage });
      }

      password = await bcrypt.hash(password, saltRounds);
      req.body.password = password;

      const result = await UserDao.signupUser({ ...req.body });
      return res.status(200).json({
        statusCode: 200,
        message: "Signup User success",
        data: result,
      });
    } catch (error) {
      log.info("Error !!!! ", error);
      return res.status(500).json({ message: "internal server error." });
    }
  }


  async login(req: express.Request, res: express.Response, user: any) {
    req.login(user, { session: false }, async (err: any) => {
      if (err) {
        res.send(err);
      }

      try {
        //<--- checks if tenantId is equals to lastloggedIn tenant and assign planId based on that tenant
        let planId = null;
        user.UserMappings.forEach((ele: any) => {
          if (ele.Tenant.id === user.lastLoggedTenantId) {
            planId = ele.Tenant.planId; //<-- Assigns the planId for that tenant
          }
        });
        // generate a signed son web token with the contents of user object and return it in the response
        const jwtToken = await token.generateJwtToken(user.id);
        return res.status(200).json({
          statusCode: 200,
          message: "Logged In successfully",
          token: jwtToken,
          tenantId: user.lastLoggedTenantId || null,
          planId: planId || null,
        });
      } catch (error) {
        log.info("Error !!!! ", error);
        return res.status(500).json({ message: "internal server error." });
      }
    });
  }


  async addPassword(req: express.Request, res: express.Response) {
    const saltRounds: number = parseInt(config.saltRounds!);
    const user: any = req.user;
    let { password } = req.body;

    password = await bcrypt.hash(password, saltRounds);

    const result = await UserDao.updatePassword({
      email: user.email,
      password,
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Update Password success",
      data: result,
    });
  }

  /**
   * Send Email with token for resetting the Password.
   *
   * @param req
   * @param res
   * @returns
   */

  async resetPasswordMail(req: express.Request, res: express.Response) {
    const { email } = req.body;

    const user = await UserDao.findOneUser(email);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email provided is Invalid", statusCode: 400 });
    }

    await this.sendResetPasswordEmail(user);

    return res.status(200).json({
      statusCode: 200,
      message: "Reset Password Mail Send Successfully",
    });
  }

  async sendConfirmMail(req: express.Request, res: express.Response) {
    const user = req.user;

    await this.sendEmailConfirmMail(user);

    return res.status(200).json({
      statusCode: 200,
      message: "Confirm Mail Send Successfully",
    });
  }

  async confirmMail(req: express.Request, res: express.Response) {
    let { tokenSecret } = req.body;

    const tokenResult = await TokenDao.getToken({
      tokenSecret,
      type: config.token.confirmMail,
      expiry: moment().utc().format(),
    });

    if (!tokenResult || !tokenResult?.user?.id) {
      throw new Error("Token is not valid");
    }

    const updateUser = await UserDao.updateMailStatus({
      emailVerified: true,
      id: tokenResult.user.id,
    });

    const deleteToken = await TokenDao.deleteToken({
      id: tokenResult.id,
      type: tokenResult.type,
      user: tokenResult.user,
    });

    return updateUser;
  }

  /**
   * Reset Password with taking token. which send on the Email
   *
   * @param req
   * @param res
   * @returns
   */

  async resetPassword(req: express.Request, res: express.Response) {
    let { tokenSecret, password } = req.body;
    const saltRounds: number = parseInt(config.saltRounds!);

    const tokenResult = await TokenDao.getToken({
      tokenSecret,
      type: config.token.resetPassword,
      expiry: moment().utc().format(),
    });

    if (!tokenResult || !tokenResult?.user?.id) {
      throw new Error("Token is not valid");
    }
    password = await bcrypt.hash(password, saltRounds);
    const changePassword = await UserDao.updatePassword({
      password,
      email: tokenResult.user.email,
    });

    // delete the token after it Changing the Password.

     const deleteToken = await TokenDao.deleteToken({id:tokenResult.id , userId: tokenResult.user.id , type: config.token.resetPassword})

   
     return changePassword
  }

  async changePassword(req: express.Request, res: express.Response) {
    let { oldPassword, password } = req.body;
    const user: any = req.user;
    const saltRounds: number = parseInt(config.saltRounds!);

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      throw new Error("Old password does not match");
    }

    password = await bcrypt.hash(password, saltRounds);

    const changePasswordResult = await UserDao.updatePassword({
      password,
      email: user.email,
    });

    return changePasswordResult;
  }

  




  /**
   * Send Email to  Reset the Password
   *
   * create a token , then create a email body with that token.
   *
   * Then send to the user The mail
   *
   * @param user
   * @returns
   */

   private async sendResetPasswordEmail(user: any): Promise<object> {
    const tokenSecret: string = uuidv4();
    const expiry: string = moment()
      .add(config.passwordResetExpiry, "minutes")
      .utc()
      .format();
    const type: string = config.token.resetPassword;

    const token: any = await TokenDao.createToken({
      user,
      tokenSecret,
      expiry,
      type,
    });

    let resetPasswordLink: string = `${config.clientUrl}/auth/?resetToken=${tokenSecret}`;

    const emailBody: string = await EmailComposer.composeResetPasswordEmail({
      userName: user.firstName,
      resetPasswordLink,
      resetPasswordLinkValidity: config.passwordResetExpiry!.toString(),
    });

    let customers = [
      {
        customerEmail: user.email,
        customerName: user.firstName,
        customerId: user.id,
      },
    ];

    let sendEmailResult = await sendEmail({
      customers,
      emailSubject: "Password Reset",
      emailBody,
      clientUserId: user.id,
      tenantId: user?.tenantId || undefined,
    });

    return sendEmailResult;
  }

  /**
   * Send Email to  Confirm Email Address
   *
   * create a token , then create a email body with that token.
   *
   * Then send to the user The mail
   *
   * @param user
   * @returns
   */

  private async sendEmailConfirmMail(user: any) {
    if (!user.emailVerified) {
      const tokenSecret: string = uuidv4();
      const expiry: string = moment()
        .add(config.emailConfirmExpiry, "days")
        .utc()
        .format();
      const type: string = config.token.confirmMail;

      const token: any = await TokenDao.createToken({
        user,
        tokenSecret,
        expiry,
        type,
      });

      let confirmMailLink: string = `${config.clientUrl}/auth/?emailConfirmToken=${tokenSecret}`;

      const emailBody: string = await EmailComposer.composeVerifyEmail({
        userName: user.firstName,
        userEmail: user.email,
        confirmMailLink,
        emailConfirmExpiry: config.emailConfirmExpiry!.toString(),
      });

      let customers = [
        {
          customerEmail: user.email,
          customerName: user.firstName,
          customerId: user.id,
        },
      ];

      let sendEmailResult = await sendEmail({
        customers,
        emailSubject: "Confirm Email",
        emailBody,
        clientUserId: user.id,
        tenantId: user?.tenantId || undefined,
      });

      return sendEmailResult;
    } else {
      throw new Error("Email is Already Verified");
    }
  }

}

export default new AuthController();
