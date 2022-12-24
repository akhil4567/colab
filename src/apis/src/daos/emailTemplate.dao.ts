import { json } from "express";
import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");


const Sequelize = db.dbInterface.Sequelize;

class EmailTemplateDao {
  constructor() {
 
  }

  async getAllTemplates(data: any) {
    const emailTemplate: any = await db.dbInterface.models.EmailTemplate.findAll({
      where: { tenantId: data.user.tenantId },

      order: [["title", "ASC"]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
    });

    return emailTemplate;
  }


  async getDeleteEmailTemplate(data: any) {
    const emailTemplate: any = await db.dbInterface.models.EmailTemplate.findAll({
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

    return emailTemplate;
  }

 /**
  * crate Email Template from the Data.
  * 
  * @param data 
  * @returns EmailTemplate
  */

  async createEmailTemplate(data: any) {
    
  
      const EmailTemplate: any = await db.dbInterface.models.EmailTemplate.create(
        {
          title: data.title,
          body: data.body,
          subject: data.subject,
          userId: data.user.id,
          createdBy: data.user.id,
          updatedBy: data.user.id,
          tenantId: data.user.tenantId,
        },
        
      );

   

      return EmailTemplate;
  
  }

  /**
   *  Update Existing Email Template.
   *
   * @param data
   * @returns
   */

  async updateTemplate(data: any) {

    const EmailTemplate: any = await db.dbInterface.models.EmailTemplate.update(
      {
        title: data.title,
        body: data.body,
        subject: data.subject,
        userId: data.user.id,
        updatedBy: data.user.id,
      },
      {
        where:{tenantId: data.user.tenantId , id: data.id} , returning: true
      }
      
    );
    
    return EmailTemplate
  }

  async deleteEmailTemplate(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any = await db.dbInterface.models.EmailTemplate.update(
        {
          updatedBy: data.user.id,
        },
        {
          where: { id: data.id  , tenantId: data.user.tenantId},
          transaction,
        }
      );

      log.info("Email Template Update. --> ", JSON.stringify(updateLog));

     

      const emailTemplate: any = await db.dbInterface.models.EmailTemplate.destroy(
        {
          where: { id: data.id },
          transaction
        }
      );

      log.info("Deleted Email Template --> ", JSON.stringify(emailTemplate));

      await transaction.commit();

      return emailTemplate;
    } catch (error: any) {
      await transaction.rollback();
      log.error("Error !!!", error);
      throw new Error(error);
    }
  }
}
  


export default new EmailTemplateDao();
