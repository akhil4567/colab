import moment from "moment";
import sequelize from "sequelize";
import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
import { calendarHelper } from "../common/services/calendarHelper";
import createVideoLink from "../common/services/video";
import { IVideo, IVideoResponse } from "../common/services/video";
import NotifiactionDao from "../daos/notification.dao";

let videoLink: IVideoResponse;
const Sequelize = db.dbInterface.Sequelize;
const { Op } = Sequelize;

let attributesExclusions = [
  "createdBy",
  "updatedBy",
  "deletedAt",
  "createdAt",
  "updatedAt",
  "assignedTo",
  "tenantId",
  "slotId",
  "customerId",
  "password",
  "lastLoggedTenantId",
  "refreshToken",
  "googleId",
  "outlookId",
];

let slotAttributesExclusions = [
  "createdBy",
  "updatedBy",
  "deletedAt",
  "createdAt",
  "updatedAt",
  "assignedTo",
  "tenantId",
  "departmentId",
  "locationId",
  "slotId",
  "customerId",
  "engagementTypeId",
  "password",
  "lastLoggedTenantId",
];

class EngagementDao {
  constructor() {
    // log('Created new instance of Dao');
  }


  async getOneEngagement(id:string){
    const result = await db.dbInterface.models.Engagement.findByPk(id , {attributes: {
      exclude: attributesExclusions,
    },
    include: [
      {
        model: db.dbInterface.models.Slot,
        as: "slotDetails",
        attributes: {
          exclude: slotAttributesExclusions,
        }
        
      },
      {
        model: db.dbInterface.models.User,
        as: "assignedUser",
        attributes: {
          exclude: slotAttributesExclusions,
        },
      },
      {
        model: db.dbInterface.models.Customer,
        as: "customer",
        attributes: {
          exclude: attributesExclusions,
        },
      },
      {
        model: db.dbInterface.models.Tenant,
        as: "tenant",
        attributes: {
          exclude: attributesExclusions,
        },
      },
      {
        model: db.dbInterface.models.Department,
        as: "department",
        attributes: {
          exclude: attributesExclusions,
        },
      },
      {
        model: db.dbInterface.models.Location,
        as: "location",
        attributes: {
          exclude: attributesExclusions,
        },
      },
      {
        model: db.dbInterface.models.EngagementType,
        as: "engagementType",
        attributes: {
          exclude: attributesExclusions,
        },
      },
    ],

    })

    return result
  }

  async getEngagements(data: any) {

    let whereSearch : any = data.search ? {

      [Op.or]: {
        "$Engagement.description$": { [Op.iLike]: `%${data.search}%` },

        "$assignedUser.firstName$": { [Op.iLike]: `%${data.search}%` },

       "$assignedUser.lastName$": { [Op.iLike]: `%${data.search}%` },

       namesUserQuery: db.dbInterface.Sequelize.literal(
        `concat("assignedUser"."firstName", ' ', "assignedUser"."lastName") ILIKE '%${data.search}%'`
      ),


      "$customer.firstName$": { [Op.iLike]: `%${data.search}%` },
      "$customer.middleName$": { [Op.iLike]: `%${data.search}%` },

      "$customer.lastName$": { [Op.iLike]: `%${data.search}%` },

      namesCustomerQuery: db.dbInterface.Sequelize.literal(
       `concat("customer"."firstName", ' ',"customer"."middleName",' ', "customer"."lastName") ILIKE '%${data.search}%'`
     ),


       },
    }:{}

    let subQuery = data.search ? { subQuery: false } : {};

    //TODO user can see all the engagements.
    let whereOptions: any = {};
    data.userId ? (whereOptions.assignedTo = data.userId) : null;
    data.customerId ? (whereOptions.customerId = data.customerId) : null;
    data.locationId ? (whereOptions.locationId = data.locationId) : null;
    data.departmentId ? (whereOptions.departmentId = data.departmentId) : null;
    data.engagementTypeId ? (whereOptions.engagementTypeId = data.engagementTypeId) : null;
    whereOptions.tenantId = data.user.tenantId;

    const { rows, count }: any =
      await db.dbInterface.models.Engagement.findAndCountAll({
        where: {
            [Op.not]: {
                [Op.or]: [{
                    engagementDateTime: { [Op.gt]: data.endDate }
                },{
                    engagementDateTime: { [Op.lt]: data.startDate }
                }]
            },
            ...whereOptions,
            ...whereSearch
        },
        ...subQuery,
        limit: data.limit,
        offset: data.offset > 0 ? --data.offset * data.limit : 0,distinct:true,
        attributes: {
          exclude: attributesExclusions,
        },
        include: [
          {
            model: db.dbInterface.models.Slot,
            as: "slotDetails",
            attributes: {
              exclude: attributesExclusions,
            },
          },
          {
            model: db.dbInterface.models.User,
            as: "assignedUser",
            attributes: {
              exclude: attributesExclusions,
            },
          },
          {
            model: db.dbInterface.models.Customer,
            as: "customer",
            attributes: {
              exclude: attributesExclusions,
            },
          },
          {
            model: db.dbInterface.models.Tenant,
            as: "tenant",
            attributes: {
              exclude: attributesExclusions,
            },
          },
          {
            model: db.dbInterface.models.Department,
            as: "department",
            attributes: {
              exclude: attributesExclusions,
            },
          },
          {
            model: db.dbInterface.models.Location,
            as: "location",
            attributes: {
              exclude: attributesExclusions,
            },
          },
          {
            model: db.dbInterface.models.EngagementType,
            as: "engagementType",
            attributes: {
              exclude: attributesExclusions,
            },
          },
        ],
      });

    log.info("Engagements --> ", rows.dataValues, count);
    return { data: rows, engagementCount: count };
  }

  async getEngagementsByremainderTime(data: any) {

    const {rows, count}: any = await db.dbInterface.models.Engagement.findAndCountAll({
        where: {
            [Op.not]: {
                [Op.or]: [{
                  emailReminderTime: { [Op.gt]: data.endDate }
                },{
                  emailReminderTime: { [Op.lt]: data.startDate }
                }]
            },
            
        },
        limit: data.limit,
        offset: data.offset > 0 ? --data.offset * data.limit : 0,
        attributes: {
            exclude: attributesExclusions
        },
        include: [
            {
                model: db.dbInterface.models.Slot,
                as: "slotDetails",
                attributes: {
                    exclude: attributesExclusions,
                },
            },
            {
                model: db.dbInterface.models.User,
                as: "assignedUser",
                attributes: {
                    exclude: attributesExclusions,
                },
            },
            {
                model: db.dbInterface.models.Customer,
                as: "customer",
                attributes: {
                    exclude: attributesExclusions,
                },
            },
            {
              model: db.dbInterface.models.Tenant,
              as: "tenant",
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.Department,
              as: "department",
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.Location,
              as: "location",
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.EngagementType,
              as: "engagementType",
              attributes: {
                exclude: attributesExclusions,
              },
            }
        ],
    });

    log.info("Engagements --> ", rows.dataValues, count )
    return {data: rows, engagementCount: count};
  }

  async getEngagementsDateCount(data: any) {
    let whereOptions: any = {};
    data.userId ? (whereOptions.assignedTo = data.userId) : null;
    data.customerId ? (whereOptions.customerId = data.customerId) : null;
    whereOptions.tenantId = data.user.tenantId;

    const rows: any = await db.dbInterface.models.Engagement.findAll({
      where: {
        [Op.not]: {
          [Op.or]: [
            {
              engagementDateTime: { [Op.gt]: data.endDate },
            },
            {
              engagementDateTime: { [Op.lt]: data.startDate },
            },
          ],
        },
        ...whereOptions,
      },
    });
    const externalDateCount = {} as any;
    let externalEngDates: any[] = [];

    await rows.forEach((obj: any) => {
      let formatedDate = moment(obj.createdAt).format("YYYY-MM-DD");
      if (formatedDate) {
        externalEngDates.push(formatedDate);
      }
    });
    externalEngDates.forEach((element) => {
      externalDateCount[element] = (externalDateCount[element] || 0) + 1; //<--- Counts total Datewise ExternalEngagements
    });

    let externalEngagementDateCounts = Object.entries(externalDateCount).map(
      ([Date, Count]) => ({ Date, Count })
    ); //<----- Structuring the Response
    return { externalEngagementDateCounts };
  }

  async createEngagementPublic(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    const customer = JSON.parse(data.customer);
    try {
      const [customerDetails, newCustomer]: any =
        await db.dbInterface.models.Customer.findOrCreate({
          where: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            contactNumber: customer.contactNumber,
          },
          defaults: {
            firstName: customer.firstName,
            middleName: customer.middleName,
            lastName: customer.lastName,
            customerType: customer.customerType,
            gender: customer.gender,
            dateOfBirth: customer.dateOfBirth,
            contactNumber: customer.contactNumber,
            email: customer.email,
            accountId: customer.accountId,
            addressLine1: customer.addressLine1,
            addressLine2: customer.addressLine2,
            city: customer.city,
            country: customer.country,
            zipcode: customer.zipcode,
            additionalData: customer.additionalData,
            tenantId: data.tenantId,
            // createdBy: data.user.id,
            // updatedBy: data.user.id,
          },
          transaction,
        });

      newCustomer
        ? log.warn("New Customer created --> ", customerDetails.dataValues)
        : log.info("Customer Already exists --> ", customerDetails.dataValues);
      //slot query
      const slot: any = await db.dbInterface.models.Slot.findOne({
        where: { id: data.slotId },
        include: [
          {
            model: db.dbInterface.models.User,
            as: 'assigneeDetails',
            attributes: {
              exclude: slotAttributesExclusions,
            },
          },
        ],
      });
      slot['User'] = slot.assigneeDetails;
      //create video call if meeting type is video
      if (slot.meetingType === "video") {
        const video: IVideo = {
          customerId: customerDetails.dataValues.id,
          customerName: `${customer.firstName} ${customer.lastName}`,
          organizerId: slot.User.id,
          organizerName: `${slot.User.firstName} ${slot.User.lastName}`,
          status: "waiting",
          type: "scheduled",
          scheduleStartTime: data.engagementDateTime,
          tenantId: data.tenantId,
        };
        videoLink = await createVideoLink(video);
      }


   

      

      let emailReminderTime: any = null;
      const tenantConfig: any =
        await db.dbInterface.models.TenantConfiguration.findOne({
          where: {
            tenantId: data.tenantId,
          },
        });
      log.warn(
        "tenantConfig ---> ",
        tenantConfig.enableEmailReminder,
        tenantConfig.emailReminderTime
      );

      if (tenantConfig?.enableEmailReminder) {
        emailReminderTime = moment
          .utc(data.engagementDateTime, "YYYY-MM-DD hh:mm:ss")
          .subtract(tenantConfig.emailReminderTime, "minutes")
          .format();
      }

      const result: any = await db.dbInterface.models.Engagement.create(
        {
          description: data.description,
          engagementDuration: data.engagementDuration,
          engagementDateTime: data.engagementDateTime,
          slotId: data.slotId,
          customerId: customerDetails.dataValues.id,
          assignedTo: data.assignedTo,
          tenantId: data.tenantId,
          departmentId: data.departmentId,
          locationId: data.locationId,
          engagementTypeId: data.engagementTypeId,
          videolocation: videoLink?.data?.id,
          videoProvider: "engage",
          emailReminderTime: emailReminderTime,
        },
        { transaction }
      );

      log.info("Engagement created ---> ", result);

      /**
       *  Create an Entry in the Google / Outlook Calenders
       */

      const calendar : any = {
        timeZone : slot.slotTimeZone,
        description: data.description,
        start: data.engagementDateTime,
        recurrence: false,
        user : slot.User,
        attendees : [customer.email ,slot.User.email],
        end :  moment(data.engagementDateTime).add(data.engagementDuration , 'minutes').utc().format()
        // summary,
        // location
      }

      const addToCalender = await calendarHelper.createCalendarEvent(calendar) 

      let fileData: any = data.attachmentFileData;
      if (fileData) {
        var document: any = await db.dbInterface.models.Document.create(
          {
            documentType: "engagement-document",
            fileKey: fileData.Key,
            fileName: data.fileName,
            mimeType: data.mimeType,
            customerId: customerDetails.dataValues.id,
          },
          { transaction }
        );
        log.info("Document created ---> ", document);
      }
        // Add documentId 
        const engagement = await db.dbInterface.models.Engagement.update(
          {
              documentId: document ? document.dataValues.id : null,
              calendarEventId: addToCalender ? addToCalender.id : null,
              calendarProvider: addToCalender ? addToCalender.provider : null
          },
          {
            where: { id: result.dataValues.id },
            returning: true,
            transaction,
          }
        );
    
      log.info("Engagement updated ---> ", engagement);

      attributesExclusions.push("id");
      const engagementFetch: any =
        await db.dbInterface.models.Engagement.findOne({
          where: {
            id: result.dataValues.id,
          },
          attributes: [],
          include: [
            {
              model: db.dbInterface.models.Slot,
              as: "slotDetails",
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.User,
              as: "assignedUser",
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.Tenant,
              as: "tenant",
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.Department,
              as: "department",
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.Location,
              as: "location",
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.EngagementType,
              as: "engagementType",
              attributes: {
                exclude: attributesExclusions,
              },
            },
          ],
          transaction,
        });
      const notification: any = await NotifiactionDao.createNotification({
        tenantId: data.tenantId,
        userId: data.assignedTo,
        data: result,
        type: "EXTERNAL_ENGAGEMENT",
        isRead: false,
      });
      log.info("Engagement Details ----> ", engagementFetch);
      await transaction.commit();
      return {
        id: result.dataValues.id,
        description: result.dataValues.description,
        engagementDuration: result.dataValues.engagementDuration,
        engagementDateTime: result.dataValues.engagementDateTime,
        customer: customerDetails,
        ...engagementFetch.dataValues,
      };
    } catch (error) {
      log.info("Error !!! ", error);
      await transaction.rollback();
      throw error;
    }
  }

  async editEngagement(data: any) {
    const result: any = await db.dbInterface.models.Engagement.update(
      {
        description: data.description,
        engagementDuration: data.engagementDuration,
        engagementDateTime: data.engagementDateTime,
        slotId: data.slotId,
        // customerId: customerDetails.dataValues.id,
        assignedTo: data.assignedTo,
        tenantId: data.tenantId,
        departmentId: data.departmentId,
        locationId: data.locationId,
        engagementTypeId: data.engagementTypeId,
        // createdBy: data.user.id,
        // updatedBy: data.user.id,
      },
      {
        where: { id: data.engagementId },
        returning: true,
      }
    );

    log.info("Engagement edited ---> ", result[1][0]);
    return result[1][0];
  }

  async deleteEngagement(data: any) {
    const result: any = await db.dbInterface.models.Engagement.destroy({
      where: { id: data.engagementId },
    });

    log.info("Engagement deleted ---> ", result);
    return result;
  }
}

export default new EngagementDao();
