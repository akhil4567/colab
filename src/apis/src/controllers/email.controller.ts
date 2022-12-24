import express from "express";

import {gmailHelper} from "../common/services/gmail";
import {outlookHelper} from "../common/services/outlook";
import emailProviderDao from "../daos/emailProvider.dao";

class EmailController {
  async getGmailInbox(req: express.Request, res: express.Response) {
    let { providerId, maxResults, labels  , pageToken} = req.query;

    const params = { maxResults: 10, labelIds: ["INBOX"] , pageToken};

    let refreshToken = await this.getRefreshTokenFromId(providerId, "gmail");

    let result : any = await gmailHelper.getMails(refreshToken, params);
    

    return result;
  }

  async sendGmail(req: express.Request, res: express.Response) {
    let {
      toRecipients,
      ccRecipients,
      bccRecipients,
      replyTo,
      subject,
      text,
      html,
      providerId,
    } = req.body;

    let refreshToken = await this.getRefreshTokenFromId(providerId, "gmail");

    const options = {
      to: toRecipients,
      cc: ccRecipients,
      bcc: bccRecipients,
      replyTo: replyTo,
      subject: subject,
      text: text,
      html: html,
      // attachments: fileAttachments,
      textEncoding: "base64",
      headers: [
        { key: "X-Application-Developer", value: "Reframe Engage" },
        { key: "X-Application-Version", value: "v1.0.0.2" },
      ],
    };

    const result = await gmailHelper.sendMail(refreshToken, options);

    return result;
  }

  

  async replyGmail(req: express.Request, res: express.Response) {
    let {
      toRecipients,
      ccRecipients,
      bccRecipients,
      InReplyTo,
      References,
      MessageID,
      replyTo,
      subject,
      html,
      threadId,
      attachments,
      providerId,
    } = req.body;

    let refreshToken = await this.getRefreshTokenFromId(providerId, "gmail");

    const options = {
      to: toRecipients,
      cc: ccRecipients,
      bcc: bccRecipients,
      'In-Reply-To':InReplyTo,
      References:References,
      'Message-ID':MessageID,
      replyTo: replyTo,
      subject: subject,
      html: html,
      // attachments: fileAttachments,
      textEncoding: "base64",
      headers: [
        { key: "X-Application-Developer", value: "Reframe Engage" },
        { key: "X-Application-Version", value: "v1.0.0.2" },
      ],
    };

    const result = await gmailHelper.replyMail(refreshToken, options , threadId);

    return result;
  }

  /**
   * Get Outlook Message Inbox
   *
   * @param req
   * @param res
   * @returns Email Response , Emails Data in Json.
   */
  async getOutlookInbox(req: express.Request, res: express.Response) {
    let { providerId , pageToken } = req.query;

    const params = { maxResults: 10 , pageToken};

    let refreshToken = await this.getRefreshTokenFromId(providerId, "outlook");



    let result : any = await outlookHelper.getMails(refreshToken, params);
  

    return result;
  }

  /**
   * Send Outlook Email
   * @param req
   * @param res
   * @returns Send Message Response.
   */

  async sendOutlook(req: express.Request, res: express.Response) {
    let {
      toRecipients,
      ccRecipients,
      bccRecipients,
      subject,
      attachments,
      html,
      providerId,
    } = req.body;

    /**
     *  Get the refresh token from the Db with providerId
     *  refresh token we are not giving to the client because of
     *  security issue.
     */

    let refreshToken = await this.getRefreshTokenFromId(providerId, "outlook");

    /**
     *  create a send Mail Object from the request Data.
     */

    const sendMailData = this.createEmailObjectBody(
      subject,
      html,
      toRecipients,
      ccRecipients,
      bccRecipients,
      attachments,
      
  
    );
    const result = await outlookHelper.sendMail(
      refreshToken,
      sendMailData
    );

    return result;
  }

  async replyOutlook(req: express.Request, res: express.Response) {
    let {
      html,
      attachments,
      emailId,
      providerId,
    } = req.body;

    /**
     *  Get the refresh token from the Db with providerId
     *  refresh token we are not giving to the client because of
     *  security issue.
     */

    let refreshToken = await this.getRefreshTokenFromId(providerId, "outlook");

    const emailBody = this.createEmailObjectBody(null , html ,null , null , null , attachments )

    /**
     *  Send a Reply Email with the New html body.
     */

    const result = await outlookHelper.sendReply(
      refreshToken,
      
      emailBody , 
      emailId
    );

    return result;
  }



  async replyAllOutlook(req: express.Request, res: express.Response) {
    let {
      
      html,
      emailId,
      providerId,
      attachments
    } = req.body;

    /**
     *  Get the refresh token from the Db with providerId
     *  refresh token we are not giving to the client because of
     *  security issue.
     */

    let refreshToken = await this.getRefreshTokenFromId(providerId, "outlook");

    const emailBody = this.createEmailObjectBody(null , html ,null , null , null , attachments )

    /**
     *  Send a Reply Email with the New html body.
     */

    const result = await outlookHelper.sendReplyAll(
      refreshToken,
      emailBody , 
      emailId
    );

    return result;
  }



  async forwardOutlook(req: express.Request, res: express.Response) {
    let {
      ccRecipients,
      bccRecipients,
      toRecipients,
      attachments,
      html,
      emailId,
      providerId,
    } = req.body;

    /**
     *  Get the refresh token from the Db with providerId
     *  refresh token we are not giving to the client because of
     *  security issue.
     */

    let refreshToken = await this.getRefreshTokenFromId(providerId, "outlook");

    const emailBody = this.createEmailObjectBody(null , html , toRecipients ,ccRecipients , bccRecipients , attachments )

    /**
     *  Send a Reply Email with the New html body.
     */

    const result = await outlookHelper.forwardMail(
      refreshToken,
      emailBody , 
      emailId
    );

    return result;
  }

  /**
   * Create Email body data in structured Format.
   *
   * @param subject  subject of the Email
   * @param html  html Base64 string encoded value of the Email Body
   * @param toRecipients  Array of to Recipients
   * @param ccRecipients  Array of ccRecipients
   * @param bccRecipients  Array of bccRecipients
   * @param attachments Array of File attachments.
   * @returns  A structured Email Body with these provided Data
   */

  private createEmailObjectBody(
    subject: string | null = null,
    html: string | null = null,
    toRecipients: Array<any>  | null = null,
    ccRecipients: Array<any>  | null = null,
    bccRecipients: Array<any>  | null = null,
    attachments : Array<any> | null = null
  ) {

   


   /**
    *  Conditionally Adding the key if it exist.
    *  for Reference visit https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object
    */

    const messageBody ={message:  {
      ...(subject) && {subject: subject},
    
      ...(html) && {body: {
        contentType: "HTML",
        content: html,
      }},

      ...(toRecipients) && {toRecipients:toRecipients},
      ...(ccRecipients) &&  {ccRecipients: ccRecipients},
      ...(bccRecipients) && {bccRecipients: bccRecipients},
      ...(attachments)  && {attachments: attachments},
    },
      saveToSentItems: 'true'
      
    };
    return messageBody
  }

  /**
   * To get the required Refresh token from ProviderId.
   *
   * @param providerId  id or the provider Created by oAuth
   * @param provider  "outlook" or "google"
   * @returns  refresh token of specified ProviderId.
   */

  private async getRefreshTokenFromId(providerId: any, provider: string) {
    let emailProvider = await emailProviderDao.findEmailProviderById(
      providerId
    );

    if (!emailProvider) {
      throw new Error("Invalid Email Provider Id");
    }
    if (emailProvider.provider !== provider) {
      throw new Error("Invalid Provider Type.");
    }

    let refreshToken = emailProvider.refreshToken;
    return refreshToken;
  }
}

export default new EmailController();


// const fileAttachments = [
//   {
//     filename: 'attachment1.txt',
//     content: 'This is a plain text file sent as an attachment',
//   },
//   {
//     path: path.join(__dirname, './attachment2.txt'),
//   },
//   {
//     filename: 'websites.pdf',
//     path: 'https://www.labnol.org/files/cool-websites.pdf',
//   },

//   {
//     filename: 'image.png',
//     content: fs.createReadStream(path.join(__dirname, './attach.png')),
//   },
// ];