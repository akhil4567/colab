import { cryptoCypher } from "../classes/cryptoCypher.class";
import { log } from "../classes/log.class";
import { config } from "../config/config";
var atob = require("atob");
var base64 = require('js-base64').Base64;

const MailComposer = require("nodemailer/lib/mail-composer");

const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
];

const oAuth2Client = new google.auth.OAuth2(
  config.gmail.client_id,
  config.gmail.client_secret
);

class GmailHelper {
  constructor() {}

  async getGmailClient(refreshToken: string) {
    const decryptedRefreshToken : string = cryptoCypher.decryptRefreshToken(refreshToken)
    oAuth2Client.setCredentials({ refresh_token: decryptedRefreshToken });

    let token: any = await oAuth2Client.refreshAccessToken();
    oAuth2Client.setCredentials(token.res.data);

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    return gmail;
  }

  async getMails(refreshToken: string, params: any) {
   
      let result: any = [];
      let threadResult : any = [];

      const gmail = await this.getGmailClient(refreshToken);

  

      // const threadList: any = await gmail.users.threads.list({
      //   userId: "me",
      //   ...params,
      // });

      // let threadArray = threadList.data.threads

      // for(const thread of threadArray){

      //   let threadResponse : any = {threadId :thread.id , messages:[]}

      //   let threadData = await gmail.users.threads.get({
      //     userId: "me",
      //     id: thread["id"],
      //     metadataHeaders:["In-Reply-To","References","Message-ID","Subject"],
      //     format : "FULL"
      //   });
        
       
      //   for(const msg of threadData.data.messages){
          

      //     let messageResponse: any = this.messageExtractFromThread(msg);
       

      //   threadResponse.messages.push(messageResponse)


      //   }

      //   threadResult.push(threadResponse)
      
        
      // }

      const messageList: any = await gmail.users.messages.list({
        userId: "me",
        ...params,
      });
      let messageArray = messageList.data.messages;
      for (const msg of messageArray) {
      

        let message = await gmail.users.messages.get({
          userId: "me",
          id: msg["id"],
          metadataHeaders:["In-Reply-To","References","Message-ID","Subject"],
          format : "FULL"
        });


        

        let messageResponse: any | undefined;
        ({ messageResponse, message } = this.messageExtractFromMessage(message, msg));
       

        result.push(messageResponse);
      }

      return {type:"google",  emails: result, nextPageToken: messageList.data.nextPageToken , threadResult };
    
  }

  private messageExtractFromMessage(message: any, msg: any) {
    let messageResponse: any = {};
    message = message.data.payload;



    for (const ele of message.headers) {
      if (ele.name === "To") {
        messageResponse.To = ele.value;
      }
      if (ele.name === "References") {
        messageResponse.References = ele.value;
      }

      if (ele.name === "Message-ID") {
        messageResponse.MessageID = ele.value;
     }

      if (ele.name === "In-Reply-To") {
        messageResponse.InReplyTo = ele.value
     }


      if (ele.name === "Delivered-To") {
        messageResponse.DeliveredTo = ele.value;
      }
      if (ele.name === "Received") {
        messageResponse.ReceivedAt = ele.value.split(";")[ele.value.split(";").length - 1];
      }

      if (ele.name === "Reply-To") {
        messageResponse.DeliveredTo = ele.value;
      }

      if (ele.name === "From") {
        messageResponse.From = ele.value;
      }

      if (ele.name === "Subject") {
        messageResponse.Subject = ele.value;
      }
    }

    let encodedBody: any = "";
    let attachments: any = [];

    if (message.mimeType === "multipart/mixed") {
      message.parts.forEach((part: any) => {
        if (part.mimeType === "image/png" || part.mimeType === "image/jpeg") {
          attachments.push(part);
        }
      });
      message = message.parts.filter(function (part: any) {
        return part.mimeType == "multipart/alternative";
      });
      message = message[0];
    }
    if (message.mimeType === "multipart/related") {

      message.parts.forEach((part: any) => {
        if (part.mimeType === "image/png" || part.mimeType === "image/jpeg") {
          attachments.push(part);
        }
      });

      message = message.parts.filter(function (part: any) {
        return part.mimeType == "multipart/alternative";
      });
      message = message[0];


    }

    if (message.mimeType === "multipart/alternative") {
      let part = message.parts.filter(function (part: any) {
        return part.mimeType == "text/html";
      });

      encodedBody = part[0].body.data;
    } else if (message.mimeType === "text/html") {
      encodedBody = message.body.data;
    }

    let htmlBody = atob(encodedBody.replace(/-/g, "+").replace(/_/g, "/"));
    //TODO fetch attachments along the response or user saprate route for it. check with gouse.
    messageResponse.attachments = attachments;
    messageResponse.threadId = msg.threadId;
    messageResponse.messageId = msg.id;

    messageResponse.htmlBody = htmlBody;
    return { messageResponse, message };
  }

  private messageExtractFromThread(msg: any) {
    let messageResponse: any = {};

    let message = msg.payload;

    for (const ele of message.headers) {
      if (ele.name === "To") {
        messageResponse.To = ele.value;
      }

      if (ele.name === "References") {
        messageResponse.References = ele.value;
      }

      if (ele.name === "Message-ID") {
        messageResponse.MessageID = ele.value;
     }

      if (ele.name === "In-Reply-To") {
        messageResponse.InReplyTo = ele.value
     }

      if (ele.name === "Delivered-To") {
        messageResponse.DeliveredTo = ele.value;
      }
      if (ele.name === "Received") {
        messageResponse.ReceivedAt = ele.value.split(";")[ele.value.split(";").length - 1];
      }

      if (ele.name === "Reply-To") {
        messageResponse.DeliveredTo = ele.value;
      }

      if (ele.name === "From") {
        messageResponse.From = ele.value;
      }

      if (ele.name === "Subject") {
        messageResponse.Subject = ele.value;
      }
    }

    let encodedBody: any = "";
    let attachments: any = [];

    if (message.mimeType === "multipart/mixed") {
      message.parts.forEach((part: any) => {
        if (part.mimeType === "image/png" || part.mimeType === "image/jpeg") {
          attachments.push(part);
        }
      });
      message = message.parts.filter(function (part: any) {
        return part.mimeType == "multipart/alternative";
      });
      message = message[0];
    }
    if (message.mimeType === "multipart/related") {

      message.parts.forEach((part: any) => {
        if (part.mimeType === "image/png" || part.mimeType === "image/jpeg") {
          attachments.push(part);
        }
      });

      message = message.parts.filter(function (part: any) {
        return part.mimeType == "multipart/alternative";
      });
      message = message[0];


    }

    if (message.mimeType === "multipart/alternative") {
      let part = message.parts.filter(function (part: any) {
        return part.mimeType == "text/html";
      });

      encodedBody = part[0].body.data;
    } else if (message.mimeType === "text/html") {
      encodedBody = message.body.data;
    }

    let htmlBody = atob(encodedBody.replace(/-/g, "+").replace(/_/g, "/"));
    //TODO fetch attachments along the response or user saprate route for it. check with gouse.
    messageResponse.attachments = attachments;
    messageResponse.threadId = msg.threadId;
    messageResponse.messageId = msg.id;

    messageResponse.htmlBody = htmlBody;
    return messageResponse;
  }

  /**
   * Encoded the Email
   *
   * @param message
   * @returns
   */

  encodeMessage(message: any) {
    return Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  /**
   * Create the Mail using Node Mailer composer. and encode it.
   *
   * @param options
   * @returns
   */
  async createMail(options: any) {
    const mailComposer = new MailComposer(options);
    const message = await mailComposer.compile().build();
    return this.encodeMessage(message);
  }

  /**
   * Send Mail Using Gmail Api
   * 
   * @param refreshToken 
   * @param options 
   * @returns 
   */

  async sendMail(refreshToken: string, options: any) {
    const gmail = await this.getGmailClient(refreshToken);

    const rawMessage = await this.createMail(options);
    const sendMailResult = await gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: rawMessage,
      },
    });
    log.info("-- Gmail Send Response ---",sendMailResult)
    return true ;
  }

  async replyMail(refreshToken: string, options: any,threadId:string) {
    const gmail = await this.getGmailClient(refreshToken);

    const rawMessage = await this.createMail(options);
    const sendMailResult = await gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: rawMessage,
        threadId
      },
    });
    log.info("-- Gmail Send Response ---",sendMailResult)
    return true ;
  }

  // async revokeToken(refreshToken: string) {
  //   const decryptedRefreshToken : string = cryptoCypher.decryptRefreshToken(refreshToken)
  //   oAuth2Client.setCredentials({ refresh_token: decryptedRefreshToken });

  //   let token: any = await oAuth2Client.refreshAccessToken();
  //   oAuth2Client.setCredentials(token.res.data);

  //   let tokenRevoke = await oAuth2Client.revokeToken(decryptedRefreshToken )
 

     
  //   log.info("-- Token Revoke Response ---",tokenRevoke)
  //   return tokenRevoke
  // }
}

export const gmailHelper =  new GmailHelper();
