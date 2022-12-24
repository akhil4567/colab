import express from "express";
import { config } from "../common/config/config";
import EngagementDao from "../daos/engagement.dao";
import moment from "moment-timezone";
import { calendarHelper } from "../common/services/calendarHelper";

import sendMessage from "../common/services/sms";
import TenantDao from "../daos/tenant.dao";
import slotDao from "../daos/slot.dao";

const AWS = require("aws-sdk");
AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  region: process.env.AWS_REGION,
});

class EngagementController {

    async getEngagements(req: express.Request, res: express.Response) {
        const result = await EngagementDao.getEngagements({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            startDate: req.query.startdate || moment().startOf("day").utc().format(),
            endDate: req.query.enddate || moment().add(7, "days").endOf("day").utc().format(),
            customerId: req.query.customerId || null,
            userId: req.query.userId || null,
            locationId: req.query.locationId || null,
            departmentId: req.query.departmentId || null,
            engagementTypeId: req.query.engagementTypeId || null,
            search: req.query.search || null,
            user: req.user
        });
        return result;
    }
   
    async getEngagementsDateCount(req: express.Request, res: express.Response) {
        const result = await EngagementDao.getEngagementsDateCount({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            startDate: req.query.startdate || moment().startOf("day").utc().format(),
            endDate: req.query.enddate || moment().add(7, "days").endOf("day").utc().format(),
            customerId: req.query.customerId || null,
            userId: req.query.userId || null,
            user: req.user
        });
        return result;
    }

  async createEngagementPublic(req: express.Request, res: express.Response) {
    const file_data: any = req.file;
    let body = req.body;
    let attachmentFileData = null;
    if (file_data) {
      // If image file is being sent in the body, storing the image in S3 bucket
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
      });

      const tenant: any = await TenantDao.getTenantDetails({
        id: body.tenantId,
      });
      const tenantName = tenant.dataValues.name.replace(/ {1,}/g, "-");
      /**
       * Params that are passed for S3 file Upload function
       */
      const params = {
        Bucket: config.s3.uploadProfileImageBucket,
        Key: `${config.s3.tenantFilesDirectory}/${body.tenantId}/engagements/${file_data.originalname}`,
        Body: file_data.buffer,
        ACL: config.s3.uploadProfileImageACL,
      };

      /**
       * Uploading image into S3 bucket
       */
      const s3_upload_data: any = await new Promise((resolve) => {
        s3.upload(params, function (error: any, data: any) {
          resolve({ error, data });
        });
      });
      attachmentFileData = s3_upload_data.data;
    }

    const result = await EngagementDao.createEngagementPublic({
      ...req.body,
      attachmentFileData: attachmentFileData,
      mimeType: file_data?.mimetype,
      fileName: file_data?.originalname,
    });

    let customerDetails: any = result.customer.dataValues;
    let locationDetails = result.location.dataValues;

    let tenantName = result.tenant.dataValues.name;
    let departmentName = result.department.dataValues.name;
    let engagementType = result.engagementType.dataValues.name;
    let engagementstartDate = result.engagementDateTime;
    let engagementEndDate = new Date(
      engagementstartDate.getTime() + result.engagementDuration * 60000
    );
    let dateString =
      engagementstartDate.getDate() +
      "-" +
      (engagementstartDate.getMonth() + 1) +
      "-" +
      engagementstartDate.getFullYear();
    let startTime =
      engagementstartDate.getHours() +
      ":" +
      ("0" + engagementstartDate.getMinutes()).slice(-2);
    let endTime =
      engagementEndDate.getHours() +
      ":" +
      ("0" + engagementEndDate.getMinutes()).slice(-2);
    let locationAddress =
      locationDetails.address +
      ", " +
      locationDetails.street +
      ", " +
      locationDetails.city +
      ", " +
      locationDetails.state +
      ", " +
      locationDetails.zipcode;

    const message: any = {
      messageBody:
        `Your Appointment Details for ${tenantName} on ${dateString}` +
        ` between ${startTime} and ${endTime} at ${locationAddress} ` +
        `for Department ${departmentName}, engage Type ${engagementType}`,
      customers: [
        {
          customerMobileNumber: customerDetails.contactNumber,
          customerId: customerDetails.id,
          customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        },
      ],
      type: "outbound",
      numberId: null,
    };
    const sendMessageResponse = await sendMessage(message);
    return result;
  }

  async editEngagement(req: express.Request, res: express.Response) {
    const currentEngagement: any = await EngagementDao.getOneEngagement(
      req.params.id
    );

    const body = req.body;

    const updateEngagement = await EngagementDao.editEngagement({
      ...body,
      engagementId: req.params.id,
    });

    const slot: any = await slotDao.getSlot({ slotId: body.slotId });

    /**
     *  Create an Entry in the Google / Outlook Calenders
     */

    const calendar: any = {
      provider: currentEngagement.calendarProvider,
      calendarEventId: currentEngagement.calendarEventId,
      timeZone: slot.slotTimeZone,
      description: body?.description,

      recurrence: false,
      user: slot.User,
      // attendees : [customer.email ,slot.User.email],
      // summary,
      // location
    };

    body?.engagementDateTime
      ? (calendar["start"] = body?.engagementDateTime)
      : null;
    body?.engagementDateTime && body?.engagementDuration
      ? (calendar["end"] = moment(body?.engagementDateTime)
          .add(body?.engagementDuration, "minutes")
          .utc()
          .format())
      : null;

    const updateCalender = await calendarHelper.updateCalendarEvent(calendar);

    return updateEngagement;
  }

  async deleteEngagement(req: express.Request, res: express.Response) {
    const result = await EngagementDao.deleteEngagement({
      engagementId: req.params.id,
    });
    return result;
  }
}

export default new EngagementController();
