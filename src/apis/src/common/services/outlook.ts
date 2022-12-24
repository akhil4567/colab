import { Graph } from "aws-sdk/clients/detective";
import { cli } from "winston/lib/winston/config";
import { config } from "../config/config";
var atob = require("atob");
import "isomorphic-fetch";
import { cryptoCypher } from "../classes/cryptoCypher.class";

const graph = require("@microsoft/microsoft-graph-client");
const { PageIterator } = require("@microsoft/microsoft-graph-client");

const msal = require("@azure/msal-node");

const { google } = require("googleapis");


class OutlookHelper {
  public msalConfig = {
    auth: {
      clientId: config.outlook.client_id,
      clientSecret: config.outlook.client_secret,
    },
  };
  public cca = new msal.ConfidentialClientApplication(this.msalConfig);
  constructor() {}

  async getAccessToken(refreshToken: string) {
    try {
      const decryptedRefreshToken : string = cryptoCypher.decryptRefreshToken(refreshToken)
    const tokenResponse = await this.cca.acquireTokenByRefreshToken({
      decryptedRefreshToken,
      scopes: ["https://graph.microsoft.com/.default"],
      // scopes: [ 'https://outlook.office.com/Mail.Read','https://outlook.office.com/Mail.ReadWrite', 'https://outlook.office.com/Mail.Send'],
    });

    const accessToken = tokenResponse.accessToken;

    return accessToken;
    } catch (error) {
      throw error
    }
  }

  async getAuthenticatedClient(refreshToken: string) {
    const accessToken = this.getAccessToken(refreshToken);
    // Initialize Graph client
    const client = graph.Client.init({
      // Use the provided access token to authenticate
      // requests
      authProvider: (done: any) => {
        done(null, accessToken);
      },
    });

    return client;
  }

  async getMails(refreshToken: string, params: any) {
    try {
      const client: any = await this.getAuthenticatedClient(refreshToken);
      let messages: any;

      if (params.pageToken) {


        // call page iterator with next page data.

        messages = await client.api(params.pageToken).get()
        console.log(messages);
        


      } else {
        /**
         * Tried to get focussed Inbox
         * all fields on orderBy is needed in filter also before anything otherwise it's showing error.
         */
        messages = await client
          .api("/me/mailFolders/inbox/messages")
          .select([
            "from",
            "isRead",
            "receivedDateTime",
            "subject",
            "body",
            "toRecipients",
            "hasAttachments",
            "importance",
          ])
          .top(params.maxResults)
          .filter(
            "receivedDateTime ge 2002-01-01T00:00:00Z and inferenceClassification eq 'focused'"
          )
          .orderby("receivedDateTime DESC")
          .get();
      }

      messages["type"] = "outlook"

      return messages;
    } catch (error) {
      console.log(error);
    }
  }

  async sendMail(refreshToken: string, mailData: any) {
    const client: any = await this.getAuthenticatedClient(refreshToken);

    const sendMail: any = await client.api("/me/sendMail").post(mailData);

    return sendMail;
  }

  async sendReply(refreshToken: string, emailBody: any, emailId: string) {
    const client: any = await this.getAuthenticatedClient(refreshToken);

    const sendReply: any = await client
      .api(`/me/messages/${emailId}/reply`)
      .post(emailBody);

    return sendReply;
  }

  async sendReplyAll(refreshToken: string, emailBody: any, emailId: string) {
    const client: any = await this.getAuthenticatedClient(refreshToken);

    const sendReplyAll: any = await client
      .api(`/me/messages/${emailId}/replyAll`)
      .post(emailBody);

    return sendReplyAll;
  }

  async forwardMail(refreshToken: string, emailBody: any, emailId: string) {
    const client: any = await this.getAuthenticatedClient(refreshToken);

    const forwardMail: any = await client
      .api(`/me/messages/${emailId}/forward`)
      .post(emailBody);

    return forwardMail;
  }

  // async deleteAllRefreshToken(refreshToken: string) {
  //   const client: any = await this.getAuthenticatedClient(refreshToken);
  //  const deleteRefreshToken =   await client.api('/me/invalidateAllRefreshTokens')
  //  .version('beta')
  //  .post();

  //  return deleteRefreshToken
 
  // }


  

}

export const outlookHelper =  new OutlookHelper();
