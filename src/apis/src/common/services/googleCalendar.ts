import { cryptoCypher } from "../classes/cryptoCypher.class";
import { config } from "../config/config";
var atob = require("atob");
var base64 = require("js-base64").Base64;

const MailComposer = require("nodemailer/lib/mail-composer");

const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
];

const oAuth2Client = new google.auth.OAuth2(
  config.google.client_id,
  config.google.client_secret
);

class GoogleCalenderHelper {
  constructor() {}

  async getCalendarClient(refreshToken: string) {
    const decryptedRefreshToken : string = cryptoCypher.decryptRefreshToken(refreshToken)
    oAuth2Client.setCredentials({ refresh_token:decryptedRefreshToken });

    let token: any = await oAuth2Client.refreshAccessToken();
    oAuth2Client.setCredentials(token.res.data);

    const calendar = google.calendar({
      version: "v3",
      auth: oAuth2Client,
    });

    return calendar;
  }

  async formatEvent(data: any) {
    let event: any = {
      // Added custom reminder option
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    data.attendees
      ? (event["attendees"] = data.attendees.map((item: any) => {
          return { email: item };
        }))
      : null;

    data.start
      ? (event["start"] = {
          dateTime: data.start,
          timeZone: data.timeZone,
        })
      : null;

    data.description
      ? (event["summary"] = {
          dateTime: data.description,
          timeZone: data.timeZone,
        })
      : null;
    data.description
      ? (event["description"] = {
          dateTime: data.description,
          timeZone: data.timeZone,
        })
      : null;

    data.location
      ? (event["location"] = {
          dateTime: data.location,
          timeZone: data.timeZone,
        })
      : null;

    data.end
      ? (event["end"] = {
          dateTime: data.end,
          timeZone: data.timeZone,
        })
      : null;

    return event;
  }

  async addEvent(refreshToken: string, data: any) {
    const calendar = await this.getCalendarClient(refreshToken);

    const event = await this.formatEvent(data);

    let addEventToCalender: any = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return addEventToCalender;
  }

  async updateEvent(refreshToken: string, eventId: string, data: any) {
    const calendar = await this.getCalendarClient(refreshToken);

    const event = await this.formatEvent(data);

    let updateEvent: any = await calendar.events.update({
      calendarId: "primary",
      eventId: eventId,
      resource: event,
    });

    return updateEvent;
  }
}

export const googleCalenderHelper = new GoogleCalenderHelper();
