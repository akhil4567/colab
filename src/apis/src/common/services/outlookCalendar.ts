import { config } from "../config/config";
import "isomorphic-fetch";
import { cryptoCypher } from "../classes/cryptoCypher.class";

const graph = require("@microsoft/microsoft-graph-client");

const msal = require("@azure/msal-node");

class OutlookCalendarHelper {
  public msalConfig = {
    auth: {
      clientId: config.outlook.client_id,
      clientSecret: config.outlook.client_secret,
    },
  };
  public cca = new msal.ConfidentialClientApplication(this.msalConfig);
  constructor() {}

  async getAccessToken(refreshToken: string) {

    const decryptedRefreshToken : string = cryptoCypher.decryptRefreshToken(refreshToken )
    const tokenResponse = await this.cca.acquireTokenByRefreshToken({
      decryptedRefreshToken,
      scopes: ["https://graph.microsoft.com/.default"],
      // scopes: [ 'https://outlook.office.com/Mail.Read','https://outlook.office.com/Mail.ReadWrite', 'https://outlook.office.com/Mail.Send'],
    });

    const accessToken = tokenResponse.accessToken;

    return accessToken;
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

  async formatEvent(data: any) {
    const event : any = {
      location: {
        displayName: data.location || null,
      },
    };

    data.attendees ? (event["attendees"] = data.attendees.map((item: any) => {
          return { emailAddress: { address: item } };
        }))
      : null;

      data.start ? event['start'] = {
        dateTime: data.start,
        timeZone: data.timeZone,
      } : null ;

      data.description ? event['subject'] = data.description : null ;

      data.end ? event['end'] = {
        dateTime: data.end,
        timeZone: data.timeZone,
      }:null;

    return event;
  }

  async createEvent(refreshToken: string, data: any) {
    const client: any = await this.getAuthenticatedClient(refreshToken);

    const event: any = await this.formatEvent(data);

    const createEvent: any = await client.api("/me/events").post(event);

    return createEvent;
  }
  

  async updateEvent(refreshToken: string,eventId:string, data: any) {
    const client: any = await this.getAuthenticatedClient(refreshToken);

    const event: any = await this.formatEvent(data);

    const updateEvent: any = await client.api(`/me/events/${eventId}`).update(event);

    return updateEvent;
  }
}

export const outlookCalendarHelper = new OutlookCalendarHelper();
