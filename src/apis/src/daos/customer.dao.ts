import sequelize from "sequelize";
import { db } from "../../../database/connection";
const Sequelize = db.dbInterface.Sequelize;
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");
let attributesExclusions = [
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
  "refreshToken",
  "googleId",
  "outlookId",
];

class CustomerDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getCustomers(data: any) {

    /**
     *  for search Names email and contact number is doing the case insensitive search.
     */

    let whereSearch: any = data.search
      ? {
        [Op.or]: {
          "$firstName$": { [Op.iLike]: `%${data.search}%` },
          "$middleName$": { [Op.iLike]: `%${data.search}%` },

          "$lastName$": { [Op.iLike]: `%${data.search}%` },
          "$contactNumber$": { [Op.iLike]: `%${data.search}%` },
          "$email$": { [Op.iLike]: `%${data.search}%` },

          /**
           *  combination of names also included in the search Query.
           */
          namesQuery: db.dbInterface.Sequelize.literal(
            `concat("firstName",' ',"middleName",' ', "lastName") ILIKE '%${data.search}%'`
          ),
          /**
           *  accountId is integer convert to string before comparing 
           */
          idQuery: sequelize.where(
            sequelize.cast(sequelize.col('Customer.accountId'), 'varchar'),
            { [Op.iLike]: `%${data.search}%` }
          ),
        },
      }
      : {};


    const { rows, count }: any = await db.dbInterface.models.Customer.findAndCountAll({
      where: {
        tenantId: data.user.tenantId,
        ...whereSearch
      },
      attributes: {
        exclude: attributesExclusions,
      },
      order: [[data.sort, data.order]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      distinct: true
    });

    return { data: rows, customerCount: count };
  }

  async getDeleteCustomers(data: any) {
    //const Op = Sequelize.Op;
    const locations: any = await db.dbInterface.models.Customer.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
        tenantId: data.user.tenantId,
      },
      order: [[data.sort, data.order]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      paranoid: false,
    });

    return locations;
  }

  async createCustomers(data: any) {
    const customer: any = await db.dbInterface.models.Customer.create({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      customerType: data.customerType,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      contactNumber: data.contactNumber,
      email: data.email,
      flag: data.flag,
      reason: data.reason,
      accountId: data.accountId,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      country: data.country,
      zipcode: data.zipcode,
      additionalData: data.additionalData,
      tenantId: data.user.tenantId,
      createdBy: data.user.id,
      updatedBy: data.user.id,
    });

    return customer;
  }

  async updateCustomers(data: any) {
    const customer: any = await db.dbInterface.models.Customer.update(
      {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        customerType: data.customerType,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        contactNumber: data.contactNumber,
        email: data.email,
        flag: data.flag,
        reason: data.reason,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        country: data.country,
        zipcode: data.zipcode,
        additionalData: data.additionalData,
        updatedBy: data.updatedBy,
      },
      { where: { id: data.id }, returning: true }
    );

    return customer[1];
  }

  async deleteCustomers(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog: any = await db.dbInterface.models.Customer.update(
        {
          updatedBy: data.user.id,
        },
        { where: { id: data.id }, transaction, returning: true }
      );

      log.info("Customer Update --> ", updateLog);

      const user: any = await db.dbInterface.models.Customer.destroy({
        where: { id: data.id },
        transaction,
      });
      log.info("Customer (Destroy) --> ", JSON.stringify(user));
      await transaction.commit();

      return user[1];
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!! ", error);
      return error;
    }
  }

  async uploadProfileImage(data: any) {
    log.info("DATA====---->>>>", data.user);
    const customer: any = await db.dbInterface.models.Customer.update(
      {
        customerProfileImage: data.profileImageURL,
      },
      {
        where: { id: data.id },
        returning: true,
      }
    );

    return customer[1];
  }
}

export default new CustomerDao();
