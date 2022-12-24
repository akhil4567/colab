import { db } from '../../../database/connection';
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");
const Sequelize = db.dbInterface.Sequelize;

class PlanDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getPlans(data: any) {
    const attributesExclusions = [
      "createdBy",
      "updatedBy",
      "deletedAt",
      "createdAt",
      "updatedAt",
    ];
    const plans: any = await db.dbInterface.models.Plan.findAll({
      attributes: {
        exclude: attributesExclusions,
      },
      include: [
        {
          model: db.dbInterface.models.Feature,
          attributes: {
            exclude: attributesExclusions,
          },
        }
      ],
        order: [['name', 'ASC']],
        limit: data.limit,
        offset: data.offset > 0 ? --data.offset * data.limit : 0
    });

    return plans;
  }

  async getDeletedPlans(data: any) {
    const plan: any = await db.dbInterface.models.Plan.findAll({
      where: {
        deletedAt:{
           [Op.ne]:null
         }
     },
     paranoid:false
    });

    return plan;
  }

  async createPlan(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const plan: any = await db.dbInterface.models.Plan.create({
          name: data.name,
          price: data.price,
          status: data.status,
          type: data.type,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        }, { transaction } );
      
      let features:any = [];
      let mappingRes:any;
      
      if(data.featureIds?.length){
          data.featureIds.forEach((id:any) => {
            features.push({
              planId: plan.id,
              featureId: id
            });
          });
          log.info("Feature IDs  -- ", features);

        mappingRes = await db.dbInterface.models.PlanFeatureMapping.bulkCreate(features, { transaction })
      log.info("Plan Feature Mapping Response  -- ",JSON.parse(JSON.stringify(mappingRes)));
        
      }

      await transaction.commit();
      log.info("Plan Created Successfully",plan);
      return plan;

    }
    catch(error){
      await transaction.rollback();
      log.info("Error !!!",error);
      return error;
    }
  }

  async updatePlan(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const plan: any = await db.dbInterface.models.Plan.update(
        {
          name: data.name,
          price: data.price,
          status: data.status,
          type: data.type,
          updatedBy: data.user.id,
        },
        { where: { id: data.id }, returning: true ,transaction}
      );

      let planFeatureRes = await db.dbInterface.models.PlanFeatureMapping.destroy({
        where: { planId : data.id },transaction
      });
      log.info("PlanFeatureResponse (Destroy) --> ",JSON.stringify(planFeatureRes));

      let features:any = [];
      let mappingRes:any;
      
      if(data.featureIds?.length){
          data.featureIds.forEach((id:any) => {
            features.push({
              planId: data.id,
              featureId: id
            });
          });
          log.info("Feature IDs  -- ",features);

        mappingRes = await db.dbInterface.models.PlanFeatureMapping.bulkCreate(features,{transaction})
      }
      log.info("Plan Feature Mapping Response  -- ",JSON.stringify(mappingRes));
      await transaction.commit();
      log.info("Plan Updated Successfully",plan);
      return plan[1];
    }
    catch(error){
      await transaction.rollback();
      log.info("Error !!!",error);
      return error;
    }
  }

  async deletePlan(data: any) { 
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any =await db.dbInterface.models.Plan.update(
        {
          updatedBy: data.user.id,
        },
        {
          where: { id: data.id },transaction
        }
      );
      log.info("PlanUpdate --> ",JSON.stringify(updateLog));
      let planFeatureRes = await db.dbInterface.models.PlanFeatureMapping.destroy({
        where: { planId : data.id },transaction
      });
      log.info("PlanFeatureResponse (Destroy) --> ",JSON.stringify(planFeatureRes));
      
      const plan: any = await db.dbInterface.models.Plan.destroy(
          {
            where: { id: data.id },transaction
          }
        );
        log.info("Plan (Destroy) --> ",JSON.stringify(plan));
        await transaction.commit();
      return plan;

    }
    catch(error){
      await transaction.rollback();
      log.info("Error !!!",error);
      return error;
    }
  }  
}

export default new PlanDao();