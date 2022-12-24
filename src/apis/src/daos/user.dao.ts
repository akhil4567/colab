import moment from "moment";
import { Model } from "sequelize/types";
import { db } from "../../../database/connection";
import { UserMapping } from "../../../database/models/userMapping";
const { Op } = require("sequelize");
import { log } from "../common/classes/log.class";
import { config } from "../common/config/config";
const Sequelize = db.dbInterface.Sequelize;

let attributesExclusions = [
  "createdBy",
  "updatedBy",
  "deletedAt",
  "createdAt",
  "updatedAt",
  "password",
  "refreshToken",
];
class UserDao {
  constructor() {}

  async getUsers(data: any) {

    /**
     *  search query is searched against firstName , lastName,
     * and firstName + lastName concat.
     * 
     */
    let nameSearchQuery: any = data.search
      ? {
          [Op.or]: {
            "$firstName$": { [Op.iLike]: `%${data.search}%` },

            "$lastName$": { [Op.iLike]: `%${data.search}%` },
            // "$UserMappings.Role.roleName$": { [Op.iLike]: `%${data.search}%` },
            namesQuery: db.dbInterface.Sequelize.literal(
              `concat("firstName", ' ', "lastName") ILIKE '%${data.search}%'`
            ),
          },
        }
      : {};


    const { rows, count }: any =
      await db.dbInterface.models.User.findAndCountAll({
        where: {
          ...nameSearchQuery,
        },

        include: [
          {
            model: db.dbInterface.models.UserMapping,
            // this is needed if we using searching included columns.
            duplicating: false,
            where: {
              tenantId: data.user.tenantId,
            },

            attributes: {
              exclude: attributesExclusions,
            },
            include: [
              {
                model: db.dbInterface.models.Tenant,
                attributes: {
                  exclude: [
                    "status",
                    "type",
                    "planId",
                    ...attributesExclusions,
                  ],
                },
              },
              {
                model: db.dbInterface.models.Role,

                attributes: {
                  exclude: attributesExclusions,
                },
              },
              {
                model: db.dbInterface.models.Department,
                attributes: {
                  exclude: attributesExclusions,
                },
              },
              {
                model: db.dbInterface.models.Location,
                attributes: {
                  exclude: attributesExclusions,
                },
              },
            ],
          },
        ],
        order: [[data.sort, data.order]],
        attributes: {
          exclude: attributesExclusions,
        },
        limit: data.limit,
        offset: data.offset > 0 ? --data.offset * data.limit : 0,
        distinct: true,
      });

    return { data: rows, userCount: count };
  }

  async getDeletedUsers(data: any) {
    const users: any = await db.dbInterface.models.User.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      attributes: {
        exclude: attributesExclusions,
      },
      order: [[data.sort, data.order]],
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      paranoid: false,
    });

    return users;
  }

  /**
   * find an user along with all it's related components
   *
   * @param data => {user: {id: "some value"}}
   * @returns One User data with Join of All Tenant , role Department
   *  Location and UserProfile.
   */

  async getOneUser(data: any) {
    const user: any = await db.dbInterface.models.User.findOne({
      include: [
        {
          model: db.dbInterface.models.UserMapping,
          attributes: {
            exclude: attributesExclusions,
          },

          include: [
            {
              model: db.dbInterface.models.Tenant,
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.Role,
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.Department,
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.Location,
              attributes: {
                exclude: attributesExclusions,
              },
            },
            {
              model: db.dbInterface.models.UserProfile,
              attributes: {
                exclude: attributesExclusions,
              },
            },
          ],
        },
      ],
      where: {
        id: data.user.id,
      },
      attributes: {
        exclude: attributesExclusions,
      },
      order: [["firstName", "ASC"]],
    });

    return user;
  }

  async findOneUser(email: any) {
    const user: any = await db.dbInterface.models.User.findOne({
      include: [
        {
          model: db.dbInterface.models.UserMapping,
          include: [
            {
              model: db.dbInterface.models.Tenant, //<---To get the planId from Tenant
            },
          ],
        },
      ],

      where: {
        email: email,
      },
    });
    return user;
  }

  // we are taking user who are deleted also
  async findOneUserWithEmail(email: any) {
    const user: any = await db.dbInterface.models.User.findOne({
      where: {
        email: email,
      },
      paranoid: false,
      raw: true,
    });
    return user;
  }

  async findUserById(id: any) {
    const user: any = await db.dbInterface.models.User.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: db.dbInterface.models.UserMapping,
        },
      ],
    });

    return user;
  }

  async findGoogleUser(googleId: any) {
    const user: any = await db.dbInterface.models.User.findOne({
      where: {
        googleId: googleId,
      },
      attributes: {
        exclude: ["password"],
      },
      raw: true,
    });

    return user;
  }

  async findOutlookUser(outlookId: any) {
    const user: any = await db.dbInterface.models.User.findOne({
      where: {
        outlookId: outlookId,
      },
      attributes: {
        exclude: ["password"],
      },
      raw: true,
    });

    return user;
  }

  async signupUser(data: any) {
    const user: any = await db.dbInterface.models.User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
    });

    return user;
  }

  /**
   *  Update password for existing user.
   */

  async updatePassword(data: any) {
    const user: any = await db.dbInterface.models.User.update(
      {
        password: data.password,
      },
      { where: { email: data.email } }
    );

    return user;
  }

  /**
   *
   * @param data Google and Outlook User.
   * @returns
   */
  async signupSocialUser(data: any) {
    const user: any = await db.dbInterface.models.User.create(data);

    return user;
  }

  async createUser(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const user: any = await db.dbInterface.models.User.create(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.contactNumber,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        },
        { transaction }
      );

      const userMapping: any = await db.dbInterface.models.UserMapping.create(
        {
          userId: user.id,
          tenantId: data.user.tenantId,
          roleId: data.roleId,
          status: data.status || "active",
          inviteStatus: "pending",
          inviteExpiry: moment()
            .add(config.inviteExpiry, "days")
            .utc()
            .format(),
        },
        { transaction }
      );
      log.info("User Mapping created successfully", userMapping);

      await transaction.commit();
      log.info("User created successfully", user);
      return user;
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!!! ", error);
      throw error;
    }
  }

  async changeTenant(data: any) {
    const user: any = await db.dbInterface.models.User.findOne({
      where: {
        id: data.user.id,
      },

      include: [
        {
          model: db.dbInterface.models.UserMapping,
        },
      ],
    });
    if (user.UserMappings.length > 0) {
      /**
       *  check the tenantId is already linked with the current User.
       * also check the invite status -> whether the user accepted the invite.
       * Also check the status is active for userMapping
       */
      const tenantExist = user.UserMappings.some(
        (el: any) =>
          el.tenantId === data.tenantId &&
          el.inviteStatus === "accept" &&
          el.status === "active"
      );
      if (!tenantExist) {
        throw new Error("Tenant Id provided is not linked with the user.");
      }

      let userUpdate: any = await db.dbInterface.models.User.update(
        {
          lastLoggedTenantId: data.tenantId,
        },
        { where: { id: data.user.id } }
      );

      return userUpdate;
    } else {
      throw new Error("User Mappings is not found");
    }
  }

  /**
   * update the outlookId and GoogleId if the user previously created the account with same email id.
   *
   * Also updating user who is soft deleted.
   *
   * @param data  googleId || outlookId
   * @param email
   * @returns
   */
  async updateSocialProfileId(data: any, email: any) {
    const user: any = await db.dbInterface.models.User.update(data, {
      where: { email: email },
      paranoid: false,
      returning: true,
    });

    return user[1];
  }

  async updateMailStatus(data: any) {
    const user: any = await db.dbInterface.models.User.update(
      { emailVerified: data.emailVerified },
      { where: { id: data.id } }
    );

    return user;
  }

  async updateUser(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const user: any = await db.dbInterface.models.User.update(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.contactNumber,
          updatedBy: data.user.id,
        },
        { where: { id: data.id }, transaction, returning: true }
      );

      const userMapping: any = await db.dbInterface.models.UserMapping.update(
        {
          roleId: data.roleId,
          departmentId: data.departmentId,
          locationId: data.locationId,
          status: data.status,
        },
        {
          where: { userId: data.id, tenantId: data.user.tenantId },
          transaction,
          returning: true,
        }
      );

      log.info("User Mapping updated successfully", userMapping);

      await transaction.commit();

      log.info("User updated Successfully ", user);

      return user[1];
    } catch (error) {
      await transaction.rollback();
      log.info("Error !!! ", error);
      throw error;
    }
  }

  async uploadProfileImage(data: any) {
    const user: any = await db.dbInterface.models.UserMapping.update(
      {
        profileImage: data.profileImageURL,
      },
      {
        where: { userId: data.user.id, tenantId: data.user.tenantId },
        paranoid: false,
        returning: true,
      }
    );

    return user[1];
  }

  // async deleteUser(data: any) {
  //   const transaction = await db.dbInterface.sequelize.transaction();
  //   try {
  //     const updateLog: any = await db.dbInterface.models.User.update(
  //       {
  //         updatedBy: data.user.id,
  //       },
  //       { where: { id: data.id }, transaction, returning: true }
  //     );

  //     log.info("User Update --> ", updateLog);

  //     let userMapping = await db.dbInterface.models.UserMapping.destroy({
  //       where: { userId: data.id },
  //       transaction,
  //     });
  //     log.info("User Mapping (Destroy) --> ", JSON.stringify(userMapping));

  //     const user: any = await db.dbInterface.models.User.destroy({
  //       where: { id: data.id },
  //       transaction,
  //     });
  //     log.info("User (Destroy) --> ", JSON.stringify(user));
  //     await transaction.commit();

  //     return user[1];
  //   } catch (error) {
  //     await transaction.rollback();
  //     log.info("Error !!! ", error);
  //     return error;
  //   }
  // }
}

export default new UserDao();
