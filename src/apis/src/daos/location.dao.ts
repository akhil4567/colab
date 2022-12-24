import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");
const Sequelize = db.dbInterface.Sequelize;
let attributesExclusions = ['createdBy','updatedBy','deletedAt','createdAt','updatedAt','assignedTo','tenantId','departmentId','locationId','slotId','customerId','engagementTypeId','password','lastLoggedTenantId','refreshToken','googleId','outlookId'];
class LocationDao {
  constructor() {
    // log('Created new instance of Dao');
  }


  

  async getLocations(data: any) {


    let whereOptions : any = {};

    data.search  ? (whereOptions['name'] = {[Op.iLike]:`%${data.search}%`}): null;

    const {rows,count}: any = await db.dbInterface.models.Location.findAndCountAll({
      where: { tenantId: data.user.tenantId , ...whereOptions },
      include: [
        {
          model: db.dbInterface.models.Department,
          as: "departments",
          attributes: {
            exclude: attributesExclusions,
        },
        },
      ],
      
      order: [[data.sort, data.order]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,distinct:true
    });
    return {data: rows, locationCount: count};
  
  }

  async getDeleteLocations(data: any) {
    const locations: any = await db.dbInterface.models.Location.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
        tenantId: data.user.tenantId
      },
      order: [[data.sort, data.order]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      paranoid: false,
    });

    return locations;
  }

  async createLocation(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const location: any = await db.dbInterface.models.Location.create(
        {
          name: data.name,
          status: data.status,
          locationLogitude: data.locationLogitude,
          locationLatitude: data.locationLatitude,
          address: data.address,
          unit: data.unit,
          street: data.street,
          state: data.state,
          city: data.city,
          zipcode: data.zipcode,
          tenantId: data.user.tenantId,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        },
        transaction
      );

      let departments: any = [];
      let mappingRes: any;

      if (data.departmentIds?.length) {
        data.departmentIds.forEach((id: any) => {
          departments.push({
            locationId: location.id,
            departmentId: id,
          });
        });
        log.info("Department IDs  -- ", departments);

        mappingRes =
          await db.dbInterface.models.LocationDepartmentMapping.bulkCreate(
            departments,
            { transaction }
          );
        log.info(
          "Location Department Mapping Responce  -- ",
          JSON.parse(JSON.stringify(mappingRes))
        );
      }

      await transaction.commit();
      log.info("Location Created Successfully", location);
      return location;
    } catch (error:any) {
      await transaction.rollback();
      log.info("Error !!!", error);
      throw new Error(error);
    }
  }

  async updateLocation(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const location: any = await db.dbInterface.models.Location.update(
        {
          name: data.name,
          status: data.status,
          locationLogitude: data.locationLogitude,
          locationLatitude: data.locationLatitude,
          address: data.address,
          unit: data.unit,
          street: data.street,
          state: data.state,
          city: data.city,
          zipcode: data.zipcode,
          tenantId: data.user.tenantId,
          updatedBy: data.user.id,
        },
        { where: { id: data.id }, returning: true, transaction }
      );
      // mapping.destroy where {locationId: data.id}
      let locationDepartmentRes =
        await db.dbInterface.models.LocationDepartmentMapping.destroy({
          where: { locationId: data.id },
          transaction,
        });
      log.info(
        "LocationDepartmentResponse (Destroy) --> ",
        JSON.stringify(locationDepartmentRes)
      );
      //return locationDepartmentRes;

      // mapping.bulkCreeate
      let departments: any = [];
      let mappingRes: any;

      if (data.departmentIds?.length) {
        data.departmentIds.forEach((id: any) => {
          departments.push({
            locationId: data.id,
            departmentId: id,
          });
        });
        log.info("Department IDs  -- ", departments);

        mappingRes =
          await db.dbInterface.models.LocationDepartmentMapping.bulkCreate(
            departments,
            { transaction }
          );
      }
      log.info(
        "Location Department Mapping Response  -- ",
        JSON.stringify(mappingRes)
      );
      await transaction.commit();
      log.info("Location Created Successfully", location);
      return location[1];
    } catch (error:any) {
      await transaction.rollback();
      log.info("Error !!!", error);
      throw new Error(error);
    }
  }

  async deleteLocation(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any = await db.dbInterface.models.Location.update(
        {
          updatedBy: data.user.id,
        },
        {
          where: { id: data.id },
          transaction,
        }
      );
      log.info("LocationUpdate --> ", JSON.stringify(updateLog));
      let locationDepartmentRes =
        await db.dbInterface.models.LocationDepartmentMapping.destroy({
          where: { locationId: data.id },
          transaction,
        });
      log.info(
        "LocationDepartmentResponse (Destroy) --> ",
        JSON.stringify(locationDepartmentRes)
      );

      const location: any = await db.dbInterface.models.Location.destroy({
        where: { id: data.id },
        transaction,
      });
      log.info("Location (Destroy) --> ", JSON.stringify(location));
      await transaction.commit();
      return location;
    } catch (error:any) {
      await transaction.rollback();
      log.info("Error !!!", error);
      throw new Error(error);
    }
  }
}

export default new LocationDao();
