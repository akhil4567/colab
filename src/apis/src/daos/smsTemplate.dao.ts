import { json } from "express";
import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");


const Sequelize = db.dbInterface.Sequelize;

class SmsTemplateDao {
  constructor() {
 
  }

  async getAllTemplates(data: any) {
    const smsTemplate: any = await db.dbInterface.models.SmsTemplate.findAll({
      where: { tenantId: data.user.tenantId },

      order: [["title", "ASC"]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
    });

    return smsTemplate;
  }


  async getDeleteSmsTemplate(data: any) {
    const smsTemplate: any = await db.dbInterface.models.SmsTemplate.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
        tenantId: data.user.tenantId,
      },
      order: [["title", "ASC"]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      paranoid: false,
    });

    return smsTemplate;
  }

 /**
  * crate Sms Template from the Data.
  * 
  * @param data 
  * @returns SmsTemplate
  */

  async createSmsTemplate(data: any) {
    
  
      const SmsTemplate: any = await db.dbInterface.models.SmsTemplate.create(
        {
          title: data.title,
          body: data.body,
          userId: data.user.id,
          tenantId: data.user.tenantId,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        },
        
      );

   

      return SmsTemplate;
  
  }

  /**
   *  Update Existing Sms Template.
   *
   * @param data
   * @returns
   */

  async updateTemplate(data: any) {

    const SmsTemplate: any = await db.dbInterface.models.SmsTemplate.update(
      {
        title: data.title,
        body: data.body,
        userId: data.user.id,
        updatedBy: data.user.id,
      },
      {
        where:{tenantId: data.user.tenantId , id: data.id} , returning: true
      }
      
    );
    
    return SmsTemplate
  }

  async deleteSmsTemplate(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any = await db.dbInterface.models.SmsTemplate.update(
        {
          updatedBy: data.user.id,
        },
        {
          where: { id: data.id  , tenantId: data.user.tenantId},
          transaction,
        }
      );

      log.info("Sms Template Update. --> ", JSON.stringify(updateLog));

     

      const smsTemplate: any = await db.dbInterface.models.SmsTemplate.destroy(
        {
          where: { id: data.id },
          transaction
        }
      );

      log.info("Deleted Sms Template --> ", JSON.stringify(smsTemplate));

      await transaction.commit();

      return smsTemplate;
    } catch (error: any) {
      await transaction.rollback();
      log.error("Error !!!", error);
      throw new Error(error);
    }
  }
}
  


export default new SmsTemplateDao();
