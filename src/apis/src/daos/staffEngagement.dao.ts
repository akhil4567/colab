import { db } from '../../../database/connection';
import { log } from '../common/classes/log.class';
import moment, { tz } from 'moment-timezone';
const Sequelize = db.dbInterface.Sequelize;
const { Op } = Sequelize;
const parser = require('cron-parser');


class StaffEngagementDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getAllStaffEngagements(data: any) {
    if ( (!data.startDate || !data.endDate) || (moment(data.startDate) > moment(data.endDate)) ) {
        throw new Error("QueryString Parameters incorrect; please correct startdate and enddate!");
    }
    const attributesExclusions = ["deletedAt","createdAt","updatedAt","password","refreshToken","lastLoggedTenantId"]
    
    let whereOptions: any = {}, mappingWhereOptions: any = {};
    data.organiserId ? whereOptions.createdBy = data.organiserId : null;
    data.userId ? mappingWhereOptions.id = data.userId : null;

    const {rows,count}: any = await db.dbInterface.models.StaffEngagement.findAndCountAll({
        where: {
            // engagementTypeId: data.engagementTypeId,
            // tenantId: data.tenantId,
            [Op.or]: [{
                [Op.not]: {
                    [Op.or]: [{
                        startDate: { [Op.gt]: data.endDate }
                    },{
                        endDate: { [Op.lt]: data.startDate }
                    }]
                }
            },{
                startDate:{
                    [Op.and]: [{ 
                        [Op.gt]: data.startDate 
                    },{ 
                        [Op.lt]: data.endDate 
                    }]
                }
            }],
            tenantId: data.user.tenantId,
            ...whereOptions
        },
        distinct:true,
         order: [[data.sort, data.order]],
        limit: data.limit,
        offset: data.offset > 0 ? --data.offset * data.limit : 0, 
        attributes: {
            exclude: ["engagementTypeId", ...attributesExclusions],
        },
        include: [{
            model: db.dbInterface.models.StaffEngagementException,
            as: "staffExceptions",
            attributes: {
                exclude: ["staffEngagementId", ...attributesExclusions],
            }
        },{
            model: db.dbInterface.models.EngagementType,
            as: "engagementType",
            attributes: {
                exclude: attributesExclusions,
            },
        },{
            model: db.dbInterface.models.User,
            as: "attendees",
            attributes: {
                exclude: attributesExclusions,
            },
            where: mappingWhereOptions,
            through: { attributes: [] }       // <-- removes Mapping table object from res
        }]
    });
    
    let holidays = await db.dbInterface.models.Holiday.findAll({
        where: {
            // tenantId: data.tenantId,
            holidayDate:{
                [Op.and]: [{ 
                    [Op.gt]: data.startDate 
                },{ 
                    [Op.lt]: data.endDate 
                }]
            }
        },
        attributes: {
            exclude: attributesExclusions,
        }
    });

    if ( !rows.length ) {
        
        return { data: rows, holidays }
    }

    await rows.forEach((sEngagement: any) => {

        if( !sEngagement.isRecurring )   {
            let formattedDay = moment(sEngagement.startDate).format("YYYY-MM-DD");
            let finalRunDay = moment.tz(formattedDay + " " + sEngagement.startTime,"YYYY-MM-DD hh:mm:ss", sEngagement.cronTimeZone);
            sEngagement.dataValues.meetingType = sEngagement.meetingMode;
            sEngagement.dataValues.meetingProvider = sEngagement.videoMeetingProvider;
            sEngagement.dataValues.meetinglocation = sEngagement.meetingLocation
            sEngagement.dataValues.meetingCount = 1;
            sEngagement.dataValues.meetingOccurrences = [finalRunDay.utc().format()];
            return;

        } else {
            const sEngagementStartTS = `${sEngagement.startDate.toJSON()}`, sEngagementEndTS = `${sEngagement.endDate.toJSON()}`
            let sEngagementStartDate, sEngagementEndDate;

            if ( data.startDate < sEngagementStartTS && data.endDate > sEngagementEndTS ) {
                sEngagementStartDate = moment.tz(sEngagementStartTS, sEngagement.cronTimeZone).startOf('day').format();
                sEngagementEndDate = moment.tz(sEngagementEndTS, sEngagement.cronTimeZone).endOf('day').format();

            } else if ( data.startDate > sEngagementStartTS && data.endDate > sEngagementEndTS ) {
                sEngagementStartDate = moment.tz(data.startDate, sEngagement.cronTimeZone).startOf('day').format();
                sEngagementEndDate = moment.tz(sEngagementEndTS, sEngagement.cronTimeZone).endOf('day').format();

            } else if ( data.startDate < sEngagementStartTS && data.endDate < sEngagementEndTS ) {
                sEngagementStartDate = moment.tz(sEngagementStartTS, sEngagement.cronTimeZone).startOf('day').format();
                sEngagementEndDate = moment.tz(data.endDate, sEngagement.cronTimeZone).endOf('day').format();

            } else if ( data.startDate > sEngagementStartTS && data.endDate < sEngagementEndTS ) {
                sEngagementStartDate = moment.tz(data.startDate, sEngagement.cronTimeZone).startOf('day').format();
                sEngagementEndDate = moment.tz(data.endDate, sEngagement.cronTimeZone).endOf('day').format();
            }

            let options = {
                currentDate: sEngagementStartDate,
                endDate: sEngagementEndDate,
                iterator: true,
                utc: true
            };

            let interval = parser.parseExpression(sEngagement.recurringDaysCron, options);
            let cronFinalRuns = [];

            while (true) {
                try {
                    let obj = interval.next();
                    let cronRunDay = obj.value.toISOString();

                    let formattedDay = moment(cronRunDay).format("YYYY-MM-DD");
                    let cronDayStartTime = moment.tz(formattedDay + " " + sEngagement.startTime,"YYYY-MM-DD hh:mm:ss", sEngagement.cronTimeZone);
                    
                    cronFinalRuns.push(cronDayStartTime.utc().format());                    
                } catch (e) {
                    break;
                }
            }
            sEngagement.dataValues.meetingCount = cronFinalRuns.length;
            sEngagement.dataValues.meetingOccurrences = cronFinalRuns;
            sEngagement.dataValues.meetingType = sEngagement.meetingMode;
            sEngagement.dataValues.meetingProvider = sEngagement.videoMeetingProvider;
            sEngagement.dataValues.meetinglocation = sEngagement.meetingLocation;
        }
    });
   console.log("test####",rows)
    return { data: rows,staffEngCount:count, holidays };
  }

  async getAllStaffEngagementsDateCount(data: any) {
    if ( (!data.startDate || !data.endDate) || (moment(data.startDate) > moment(data.endDate)) ) {
        throw new Error("QueryString Parameters incorrect; please correct startdate and enddate!");
    }
  
    let whereOptions: any = {}, mappingWhereOptions: any = {};
    data.organiserId ? whereOptions.createdBy = data.organiserId : null;
    data.userId ? mappingWhereOptions.id = data.userId : null;

    const rows: any = await db.dbInterface.models.StaffEngagement.findAll({
        where: {
            [Op.or]: [{
                [Op.not]: {
                    [Op.or]: [{
                        startDate: { [Op.gt]: data.endDate }
                    },{
                        endDate: { [Op.lt]: data.startDate }
                    }]
                }
            },{
                startDate:{
                    [Op.and]: [{ 
                        [Op.gt]: data.startDate 
                    },{ 
                        [Op.lt]: data.endDate 
                    }]
                }
            }],
            tenantId: data.user.tenantId,
            ...whereOptions
        },
    });
    const internalDateCount = {} as any;
    let internalDates :any[]=[];
    

    await rows.forEach((obj: any) => {
        let formatedDate = moment(obj.createdAt).format('YYYY-MM-DD');  
        if(formatedDate){
            internalDates.push(formatedDate)                    
      }
      
    });
      internalDates.forEach(element => {                           
      internalDateCount[element] = (internalDateCount[element] || 0) + 1;    //<--- Counts total Datewise InternalEngagements
    });
     
    let internalEngagementDateCounts = Object.entries(internalDateCount).map(([Date, Count]) => ({Date,Count})); //<----- Structuring the Response
    return {internalEngagementDateCounts};  

   
  }

  async createStaffEngagement(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try{
        const staffEngagement: any = await db.dbInterface.models.StaffEngagement.create({
            engagementTypeId: data.engagementTypeId,
            tenantId: data.user.tenantId,
            title: data.title,
            description: data.description,
            startDate: data.startDate,
            startTime: data.startTime,
            duration: data.duration,
            meetingMode: data.meetingType.toUpperCase(),
            videoMeetingProvider: "engage",
            meetingLocation: data.meetingLocation||"in-person",
            isRecurring: data.isRecurring,
            recurringDaysCron: data.isRecurring ? data.recurringDaysCron : null,
            cronTimeZone: data.isRecurring ? data.cronTimeZone : null,
            endDate: data.isRecurring ? data.endDate : null,
            createdBy: data.user.id,
            updatedBy: data.user.id
        },{ transaction });

        let users:any = [];
        let mappingRes:any;
        
        if(data.userIds?.length){
            const uniqueUserIds = [...new Set(data.userIds)];
            
            uniqueUserIds.forEach((id:any) => {
                users.push({
                    staffEngagementId: staffEngagement.id,
                    userId: id
                });
            });
            log.info("user IDs  -- ", users);

            mappingRes = await db.dbInterface.models.StaffEngagementUserMapping.bulkCreate(users, { transaction })
            log.info("user staffEngagement Mapping Response  -- ",JSON.parse(JSON.stringify(mappingRes)));
        }
        
        await transaction.commit();
        staffEngagement.dataValues.meetingType = staffEngagement.meetingMode;
        staffEngagement.dataValues.meetingProvider = staffEngagement.videoMeetingProvider;
        staffEngagement.dataValues.meetinglocation = staffEngagement.meetingLocation;
        log.info("staffEngagement Created Successfully",staffEngagement);
        return staffEngagement;
    }
    catch(error) {
        await transaction.rollback();
        log.info("Error !!!",error);
        throw error;
    }
  }

  async cancelSingleStaffEngagement(data: any) {
    
    const staffEngagementException: any = await db.dbInterface.models.StaffEngagementException.create({
        staffEngagementId: data.staffEngagementId,
        oldDateTime: data.oldDateTime,
        exceptionDescription: data.exceptionDescription,
        duration: data.duration,
        exceptionType: "CANCELLED",
        createdBy: data.user.id,
        updatedBy: data.user.id
    });
    log.info("StaffEngagement Cancelled Exception created successfully --> ", staffEngagementException.dataValues )
    return staffEngagementException;
  }

  async updateSingleStaffEngagement(data: any) {

    const staffEngagementException: any = await db.dbInterface.models.StaffEngagementException.create({
        staffEngagementId: data.staffEngagementId,
        oldDateTime: data.oldDateTime,
        exceptionDescription: data.exceptionDescription,
        duration: data.duration,
        exceptionType: "EDIT",
        meetingMode: data.meetingMode,
        videoMeetingProvider: data.videoMeetingProvider,
        meetingLocation: data.meetingLocation,
        newDateTime: data.newDateTime,
        newDescription: data.newDescription,
        createdBy: data.user.id,
        updatedBy: data.user.id
    });
    log.info("StaffEngagement Edit Exception created successfully --> ", staffEngagementException.dataValues )
    return staffEngagementException;
  }

  async updateSeriesStaffEngagement(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try{
        const staffEngagementEdit: any = await db.dbInterface.models.StaffEngagement.update({
            engagementTypeId: data.engagementTypeId,
            title: data.title,
            description: data.description,
            startDate: data.startDate,
            startTime: data.startTime,
            duration: data.duration,
            meetingMode: data.meetingMode,
            videoMeetingProvider: data.videoMeetingProvider,
            meetingLocation: data.meetingLocation,
            isRecurring: data.isRecurring,
            recurringDaysCron: data.isRecurring ? data.recurringDaysCron : null,
            cronTimeZone: data.isRecurring ? data.cronTimeZone : null,
            endDate: data.isRecurring ? data.endDate : null,
            updatedBy: data.user.id
        }, {
            where: { id: data.staffEngagementId }, returning: true, transaction
        });

        let users:any = [];
        let mappingRes:any;
        
        if(data.userIds?.length){
            let mappingDeleteRes = await db.dbInterface.models.StaffEngagementUserMapping.destroy({
                where: { staffEngagementId : data.staffEngagementId }, transaction
            });
            log.warn("StaffEngagementUserMapping (Destroy) --> ",JSON.stringify(mappingDeleteRes));

            const uniqueUserIds = [...new Set(data.userIds)];
            
            uniqueUserIds.forEach((id:any) => {
                users.push({
                    staffEngagementId: data.staffEngagementId,
                    userId: id
                });
            });
            log.warn("user IDs  -- ", users);

            mappingRes = await db.dbInterface.models.StaffEngagementUserMapping.bulkCreate(users, { transaction })
            log.warn("user staffEngagement Mapping Response  -- ",JSON.parse(JSON.stringify(mappingRes)));
        }
        log.warn("StaffEngagement Series Edited successfully --> ", staffEngagementEdit[1][0]);
        await transaction.commit();
        return staffEngagementEdit[1][0];

    } catch(error) {
        await transaction.rollback();
        log.error("Error !!!",error);
        throw error;
    }
  }

  async deleteSeriesStaffEngagement(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try{
        const exceptionDel: any = await db.dbInterface.models.StaffEngagementException.destroy({
            where: {
                staffEngagementId: data.staffEngagementId
            }, transaction
        });
        log.info("Engagement Exception Deleted successfully --> ", exceptionDel )

        const mappingDel: any = await db.dbInterface.models.StaffEngagementUserMapping.destroy({
            where: {
                staffEngagementId: data.staffEngagementId
            }, transaction
        });
        log.info("Engagement-User Mapping Deleted successfully --> ", mappingDel )

        const sEngagementDel: any = await db.dbInterface.models.StaffEngagement.destroy({
            where: {
                id: data.staffEngagementId
            }, transaction
        });
        log.info("StaffEngagement Deleted successfully --> ", sEngagementDel )
        await transaction.commit();
        return sEngagementDel;
    } catch(error) {
        await transaction.rollback();
        log.info("Error !!!",error);
        throw error;
    }
  }
  
  async deactivateStaffEngagement(data: any) {
    const staffEngagementDeactivate: any = await db.dbInterface.models.StaffEngagement.update({
        isActive: false,
        updatedBy: data.user.id
    }, {
        where: { id: data.staffEngagementId }, returning: true
    });
    log.info("StaffEngagement Deactivated successfully --> ", staffEngagementDeactivate[1][0] )
    return staffEngagementDeactivate[1][0];
  }
  
  async activateStaffEngagement(data: any) {
    const staffEngagementActivate: any = await db.dbInterface.models.StaffEngagement.update({
        isActive: true,
        updatedBy: data.user.id
    }, {
        where: { id: data.staffEngagementId }, returning: true
    });
    log.info("StaffEngagement Re-Activated successfully --> ", staffEngagementActivate[1][0] )
    return staffEngagementActivate[1][0];
  }
}

export default new StaffEngagementDao();