import { json } from "express";
import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");
const Sequelize = db.dbInterface.Sequelize;

class FeatureDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getFeatures(data: any) {
    const attributesExclusions = [
      "createdBy",
      "updatedBy",
      "deletedAt",
      "createdAt",
      "updatedAt",
    ];
    const feature: any = await db.dbInterface.models.Feature.findAll({
      attributes: {
        exclude: attributesExclusions,
      },
      include: [
        {
          model: db.dbInterface.models.Permission,
          attributes: {
            exclude: attributesExclusions,
          },
        },
      ],
      order: [['name', 'ASC']],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0
    });

    return feature;
  }

  async getDeletedFeatures(data: any) {
    const feature: any = await db.dbInterface.models.Feature.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      paranoid: false,
    });

    return feature;
  }

  async createFeature(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const feature: any = await db.dbInterface.models.Feature.create(
        {
          name: data.name,
          description: data.description,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        },
        { transaction }
      );

      let plans: any = [];
      let mappingRes: any;

      if (data.planIds?.length) {
        data.planIds.forEach((id: any) => {
          plans.push({
            featureId: feature.id,
            planId: id,
          });
        });
        log.info("Plan IDs -- ", plans);

        mappingRes =
          await db.dbInterface.models.PlanFeatureMapping.bulkCreate(
            plans,
            { transaction }
          );
        
        log.info(
          "Plan Feature Mapping Response -- ",
          JSON.parse(JSON.stringify(mappingRes))
          );
      }

      await transaction.commit();
      log.info("Feature Created Successfully", feature);

      return feature;
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!!! ", error);
      return error;
    }
  }

  async updateFeature(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();

    try {
      const feature: any = await db.dbInterface.models.Feature.update(
        {
          name: data.name,
          description: data.description,
          updatedBy: data.user.id,
        },
        { where: { id: data.id }, returning: true }
      );

      let planFeatureRes =
        await db.dbInterface.models.PlanFeatureMapping.destroy({
          where: { featureId: data.id },
          transaction,
        });

      log.info(
        "PlanFeatureResponse (Destroy) --> ",
        JSON.stringify(planFeatureRes)
      );

      let plans: any = [];
      let mappingRes: any;

      if (data.planIds?.length) {
        data.planIds.forEach((id: any) => {
          plans.push({
            featureId: data.id,
            planId: id,
          });
        });
        log.info("Plan IDs -- ", plans);
        mappingRes =
          await db.dbInterface.models.PlanFeatureMapping.bulkCreate(
            plans,
            { transaction }
          );
        
        log.info(
          "Plan Feature Mapping Response -- ",
          JSON.stringify(mappingRes)
        );
      }

      await transaction.commit();

      log.info("Feature updated Successfully ", feature);

      return feature[1];
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!! ", error);
      return error;
    }
  }

  async deleteFeature(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any = await db.dbInterface.models.Feature.update(
        {
          updatedBy: data.user.id,
        },
        {
          where: { id: data.id },
          transaction,
        }
      );

      log.info("PlanUpdate --> ", JSON.stringify(updateLog));
      let planFeatureRes =
        await db.dbInterface.models.PlanFeatureMapping.destroy({
          where: { featureId: data.id },
          transaction,
        });
      log.info(
        "PlanFeatureResponse (Destroy) --> ",
        JSON.stringify(planFeatureRes)
      );

      const feature: any = await db.dbInterface.models.Feature.destroy({
        where: { id: data.id },
        transaction,
      });
      log.info("Feature (Destroy) --> ", JSON.stringify(feature));
      await transaction.commit();

      //log.info("Plan (Destroy) --> ", JSON.stringify(plan));
      return feature;
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!!", error);
      return error;
    }
  }
}

export default new FeatureDao();
