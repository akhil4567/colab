import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
import moment, { tz } from "moment-timezone";
const Sequelize = db.dbInterface.Sequelize;
const { Op } = Sequelize;
const parser = require("cron-parser");

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

class SlotDao {
  constructor() {
    // log('Created new instance of Dao');
  }


  async getSlot(data:any){
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

    return slot

  }



  async getSlots(data: any) {
    if ( !data.startDate || !data.endDate ) {
        throw new Error("QueryString Parameters Missing; please include startdate and enddate!");
    }
    const attributesExclusions = [
      "createdBy",
      "updatedBy",
      "deletedAt",
      "createdAt",
      "updatedAt",
    ];

    let whereOptions: any = {};

    data.departmentId ? whereOptions.departmentId = data.departmentId : null;
    data.locationId ? whereOptions.locationId = data.locationId : null;
    data.engagementTypeId ? whereOptions.engagementTypeId = data.engagementTypeId : null;
    data.assignedTo ? whereOptions.assignedTo = data.assignedTo : null;
    
    const slots: any = await db.dbInterface.models.Slot.findAll({
      where: {
        [Op.not]: {
          [Op.or]: [
            {
              startDate: { [Op.gt]: data.endDate },
            },
            {
              endDate: { [Op.lt]: data.startDate },
            },
          ],
        },
        tenantId: data.user.tenantId,
        ...whereOptions
      },
      /* order: [['updatedAt', 'DESC']],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0, */
      attributes: {
        exclude: [
          "tenantId",
          "departmentId",
          "locationId",
          "engagementTypeId",
          ...attributesExclusions,
        ],
      },
      include: [
        {
          model: db.dbInterface.models.User,
          as: "assigneeDetails",
          attributes: {
            exclude: ["id", "password", ...attributesExclusions],
          },
        },
        {
          model: db.dbInterface.models.SlotException,
          as: "exceptions",
          attributes: {
            exclude: ["id", "slotId", ...attributesExclusions],
          },
        },
        {    
          model: db.dbInterface.models.Engagement,
          as: "engagements",
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

    if (!slots.length) {
      return slots;
    }
    
    let slotCount: number = 0;

    await slots.forEach((slot: any) => {
      const slotStartTS = `${slot.startDate.toJSON()}`,
        slotEndTS = `${slot.endDate.toJSON()}`;
      let slotStartDate, slotEndDate;

      if (data.startDate < slotStartTS && data.endDate > slotEndTS) {
        slotStartDate = moment
          .tz(slotStartTS, slot.slotTimeZone)
          .startOf("day")
          .format();
        slotEndDate = moment
          .tz(slotEndTS, slot.slotTimeZone)
          .endOf("day")
          .format();
      } else if (data.startDate > slotStartTS && data.endDate > slotEndTS) {
        slotStartDate = moment
          .tz(data.startDate, slot.slotTimeZone)
          .startOf("day")
          .format();
        slotEndDate = moment
          .tz(slotEndTS, slot.slotTimeZone)
          .endOf("day")
          .format();
      } else if (data.startDate < slotStartTS && data.endDate < slotEndTS) {
        slotStartDate = moment
          .tz(slotStartTS, slot.slotTimeZone)
          .startOf("day")
          .format();
        slotEndDate = moment
          .tz(data.endDate, slot.slotTimeZone)
          .endOf("day")
          .format();
      } else if (data.startDate > slotStartTS && data.endDate < slotEndTS) {
        slotStartDate = moment
          .tz(data.startDate, slot.slotTimeZone)
          .startOf("day")
          .format();
        slotEndDate = moment
          .tz(data.endDate, slot.slotTimeZone)
          .endOf("day")
          .format();
      }

      let options = {
        currentDate: slotStartDate,
        endDate: slotEndDate,
        iterator: true,
        // tz: slot.slotTimeZone,
        utc: true
      };

      let interval = parser.parseExpression(slot.weekDaysCron, options);
      let cronFinalRuns = [];
      // let cronRunDaysOnly = [];

      while (true) {
        try {
          let obj = interval.next();
          let cronRunDay = obj.value.toISOString();
          // cronRunDaysOnly.push( moment(cronRunDay).format() );

          let formattedDay = moment(cronRunDay).format("YYYY-MM-DD");
        
          let cronDayStartTime = moment.tz(
            formattedDay + " " + slot.startTime,
            "YYYY-MM-DD hh:mm:ss", slot.slotTimeZone
          );
          let cronDayEndTime = moment.tz(
            formattedDay + " " + slot.endTime,
            "YYYY-MM-DD hh:mm:ss", slot.slotTimeZone
          );

          if (slot.slotDuration) {
            while (cronDayStartTime < cronDayEndTime) {
              cronFinalRuns.push(cronDayStartTime.utc().format());
              cronDayStartTime.add(slot.slotDuration, "minutes");
            }
          } else throw new Error("slotDuration invalid");
        } catch (e) {
          log.warn("Loop catch to break loop fn, NOT critical -->", e);
          break;
        }
      }
      slot.dataValues.numberOfSlots = cronFinalRuns.length;
      slot.dataValues.slotOccurrences = cronFinalRuns;
      slotCount += cronFinalRuns.length;
      // slot.dataValues.cronRunDaysOnly = cronRunDaysOnly;
    });
    let holidays = await db.dbInterface.models.Holiday.findAll({
        where: {
            // tenantId: data.token.tenantId,
            [Op.not]: {
                [Op.or]: [{
                    holidayDate: { [Op.gt]: data.endDate }
                },{
                    holidayDate: { [Op.lt]: data.startDate }
                }]
            },
        },
        attributes: {
            exclude: attributesExclusions,
        }
    });

    return { slotCount, data: slots, holidays };
  }

  async createSlot(data: any) {

    const slot: any = await db.dbInterface.models.Slot.create({
      tenantId: data.user.tenantId,
      departmentId: data.departmentId,
      locationId: data.locationId,
      engagementTypeId: data.engagementTypeId,
      weekDaysCron: data.weekDaysCron,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      slotDuration: data.slotDuration,
      assignedTo: data.assignedTo,
      slotTimeZone: data.slotTimeZone,
      slotDescription: data.slotDescription,
      createdBy: data.user.id,
      updatedBy: data.user.id,
      meetingType:data.meetingType

    });

    return slot;
  }

  async deleteSingleSlot(data: any) {
    const slotException: any = await db.dbInterface.models.SlotException.create(
      {
        slotId: data.slotId,
        slotDateTime: data.slotDateTime,
        exceptionDescription: data.exceptionDescription,
        slotDuration: data.slotDuration,
        assignedTo: data.assignedTo,
        exceptionType: "DELETE",
        createdBy: data.user.id,
        updatedBy: data.user.id
    });
    log.info("Slot Delete Exception created successfully --> ", slotException.dataValues )
    return slotException;
  }

  async updateSingleSlot(data: any) {
    const slotException: any = await db.dbInterface.models.SlotException.create(
      {
        slotId: data.slotId,
        slotDateTime: data.slotDateTime,
        exceptionDescription: data.exceptionDescription,
        slotDuration: data.slotDuration,
        assignedTo: data.assignedTo,
        exceptionType: "EDIT",
        newAssignee: data.newAssignee,
        newDateTime: data.newDateTime,
        newDescription: data.newDescription,
        createdBy: data.user.id,
        updatedBy: data.user.id
    });
    log.info("Slot Edit Exception created successfully --> ", slotException.dataValues )
    return slotException;
  }

  async updateSeriesSlot(data: any) {
    const slotEdit: any = await db.dbInterface.models.Slot.update(
      {
        tenantId: data.user.tenantId,
        departmentId: data.departmentId,
        locationId: data.locationId,
        engagementTypeId: data.engagementTypeId,
        weekDaysCron: data.weekDaysCron,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        slotDuration: data.slotDuration,
        assignedTo: data.assignedTo,
        slotTimeZone: data.slotTimeZone,
        slotDescription: data.slotDescription,
        updatedBy: data.user.id,
      },
      {
        where: { id: data.slotId },
        returning: true,
      }
    );
    log.info("Slot Series Edited successfully --> ", slotEdit);
    return slotEdit[1][0];
  }

  async deleteSeriesSlot(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateSlot: any = await db.dbInterface.models.Slot.update(
        {
          updatedBy: data.user.id,
        },
        { where: { id: data.slotId }, transaction, returning: true }
      );

      log.info("Slot Update --> ", updateSlot);

      const slotDel: any = await db.dbInterface.models.Slot.destroy({
        where: {
          id: data.slotId,
        },
        transaction,
      });
      log.info("Slot Deleted successfully --> ", slotDel);

      await transaction.commit();
      return slotDel;
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!! ", error);
      return error;
    }
  }
  
  async publicGetSlots(data: any) {
    if ( !data.startDate || !data.endDate ) {
        throw new Error("QueryString Parameters Missing; please include startdate and enddate!");
    }
    const attributesExclusions = ["id", "slotId", "newAssignee", "createdBy", "updatedBy", "deletedAt", "createdAt", "updatedAt", "tenantId", "departmentId", "locationId", "engagementTypeId", "customerId"];

    let whereOptions: any = {};

    data.tenantId ? whereOptions.tenantId = data.tenantId : null;
    data.departmentId ? whereOptions.departmentId = data.departmentId : null;
    data.locationId ? whereOptions.locationId = data.locationId : null;
    data.engagementTypeId ? whereOptions.engagementTypeId = data.engagementTypeId : null;
    data.assignedTo ? whereOptions.assignedTo = data.assignedTo : null;
    
    const slots: any = await db.dbInterface.models.Slot.findAll({
      where: {
        [Op.not]: {
          [Op.or]: [
            {
              startDate: { [Op.gt]: data.endDate },
            },
            {
              endDate: { [Op.lt]: data.startDate },
            },
          ],
        },
        ...whereOptions
      },
      /* order: [['updatedAt', 'DESC']],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0, */
      attributes: {
        include: ["id"],
        exclude: attributesExclusions,
      },
      include: [
        {
          model: db.dbInterface.models.SlotException,
          as: "exceptions",
          attributes: {
            exclude: attributesExclusions,
          },
        },
        {    
          model: db.dbInterface.models.Engagement,
          as: "engagements",
          attributes: {
            exclude: attributesExclusions,
          },
        },
      ],
    });

    if (!slots.length) {
      return slots;
    }

    await slots.forEach((slot: any) => {
      const slotStartTS = `${slot.startDate.toJSON()}`,
        slotEndTS = `${slot.endDate.toJSON()}`;
      let slotStartDate, slotEndDate;

      if (data.startDate < slotStartTS && data.endDate > slotEndTS) {
        slotStartDate = moment
          .tz(slotStartTS, slot.slotTimeZone)
          .startOf("day")
          .format();
        slotEndDate = moment
          .tz(slotEndTS, slot.slotTimeZone)
          .endOf("day")
          .format();
      } else if (data.startDate > slotStartTS && data.endDate > slotEndTS) {
        slotStartDate = moment
          .tz(data.startDate, slot.slotTimeZone)
          .startOf("day")
          .format();
        slotEndDate = moment
          .tz(slotEndTS, slot.slotTimeZone)
          .endOf("day")
          .format();
      } else if (data.startDate < slotStartTS && data.endDate < slotEndTS) {
        slotStartDate = moment
          .tz(slotStartTS, slot.slotTimeZone)
          .startOf("day")
          .format();
        slotEndDate = moment
          .tz(data.endDate, slot.slotTimeZone)
          .endOf("day")
          .format();
      } else if (data.startDate > slotStartTS && data.endDate < slotEndTS) {
        slotStartDate = moment
          .tz(data.startDate, slot.slotTimeZone)
          .startOf("day")
          .format();
        slotEndDate = moment
          .tz(data.endDate, slot.slotTimeZone)
          .endOf("day")
          .format();
      }

      let options = {
        currentDate: slotStartDate,
        endDate: slotEndDate,
        iterator: true,
      };

      let interval = parser.parseExpression(slot.weekDaysCron, options);
      let cronFinalRuns = [];
      // let cronRunDaysOnly = [];

      while (true) {
        try {
          let obj = interval.next();
          let cronRunDay = obj.value.toISOString();
          // cronRunDaysOnly.push( moment(cronRunDay).format() );

          let formattedDay = moment(cronRunDay).format("YYYY-MM-DD");
          let cronDayStartTime = moment.tz(
            formattedDay + " " + slot.startTime,
            "YYYY-MM-DD hh:mm:ss", slot.slotTimeZone
          );
          let cronDayEndTime = moment.tz(
            formattedDay + " " + slot.endTime,
            "YYYY-MM-DD hh:mm:ss", slot.slotTimeZone
          );

          if (slot.slotDuration) {
            while (cronDayStartTime < cronDayEndTime) {
              cronFinalRuns.push(cronDayStartTime.tz("UTC").format());
              cronDayStartTime.add(slot.slotDuration, "minutes");
            }
          } else throw new Error("slotDuration invalid");
        } catch (e) {
          break;
        }
      }
      slot.dataValues.numberOfSlots = cronFinalRuns.length;
      slot.dataValues.slotOccurrences = cronFinalRuns;
      // slot.dataValues.cronRunDaysOnly = cronRunDaysOnly;

      if ( slot.engagements.length ) {
        slot.engagements.forEach( (item: any) => {
          const temp = item.engagementDateTime.toISOString().split('.')[0] + 'Z';
          item.dataValues.engagementDateTime = temp;

          const index = slot.dataValues.slotOccurrences.indexOf(temp);
          if (index > -1) { 
            slot.dataValues.slotOccurrences.splice(index, 1); 
          }
        });
      }

      if ( slot.exceptions.length ) {
        slot.exceptions.forEach( (item: any) => {
          const temp = item.slotDateTime.toISOString().split('.')[0] + 'Z';
          item.dataValues.slotDateTime = temp;
          
          const index = slot.dataValues.slotOccurrences.indexOf(temp);
          if (index > -1) { 
            if (item.exceptionType == "DELETE") {
              slot.dataValues.slotOccurrences.splice(index, 1); 
            } else if (item.exceptionType == "EDIT") {
              const temp2 = item.newDateTime.toISOString().split('.')[0] + 'Z';
              slot.dataValues.slotOccurrences.splice(index, 1, temp2); 
            }
          }
        });
      }
    });

    let holidays = await db.dbInterface.models.Holiday.findAll({
        where: {
            // tenantId: data.token.tenantId,
            [Op.not]: {
                [Op.or]: [{
                    holidayDate: { [Op.gt]: data.endDate }
                },{
                    holidayDate: { [Op.lt]: data.startDate }
                }]
            },
        },
        attributes: {
            exclude: attributesExclusions,
        }
    });

    return { data: slots, holidays };
  }
}

export default new SlotDao();
