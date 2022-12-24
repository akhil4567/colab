import { db } from '../../../database/connection';
import { log } from "../common/classes/log.class";
import userController from '../controllers/user.controller';
const { Op } = require("sequelize");
const Sequelize = db.dbInterface.Sequelize;

class RoleDao {
  constructor() {
    // log('Created new instance of Dao');
  }


  async getRoles(data: any) {


    let whereOptions : any = {};

    data.search  ? (whereOptions['roleName'] = {[Op.iLike]:`%${data.search}%`}): null;


    const attributesExclusions = [
        "createdBy",
        "updatedBy",
        "deletedAt",
        "createdAt",
        "updatedAt",
      ];
    const {rows, count}: any = await db.dbInterface.models.Role.findAndCountAll({
      where: {
        tenantId: data.user.tenantId,
        ...whereOptions
      },
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
        {
            model: db.dbInterface.models.UserMapping,
            attributes: {
              exclude: attributesExclusions,
            },
            include: [
              {
                model: db.dbInterface.models.User,
                attributes: {
                  exclude: attributesExclusions,
                },
              }
            ]
          },
      ],
        order: [[data.sort, data.order]],
        limit: data.limit,
        offset: data.offset > 0 ? --data.offset * data.limit : 0,
        distinct:true
    });

    return {data:rows, rolesCount:count};
  }

  async createRole(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const role: any = await db.dbInterface.models.Role.create({
          roleName: data.roleName,
          description: data.description,
          tenantId: data.user.tenantId,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        }, { transaction } );
      
      let permissions:any = [];
      let mappingRes:any;
      
      if(data.permissionIds?.length){
          data.permissionIds.forEach((id:any) => {
            permissions.push({
              roleId: role.id,
              permissionId: id
            });
          });
          log.info("Permission IDs  -- ", permissions);

        mappingRes = await db.dbInterface.models.RolePermissionMapping.bulkCreate(permissions, { transaction })
      log.info("Role Permission Mapping Response  -- ",JSON.parse(JSON.stringify(mappingRes)));
        
      }

      await transaction.commit();
      log.info("Role Created Successfully",role);
      return role;

    }
    catch(error){
      await transaction.rollback();
      log.info("Error !!!",error);
      return error;
    }
  }

  async updateRole(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const role: any = await db.dbInterface.models.Role.update(
        {
            roleName: data.roleName,
            description: data.description,
            tenantId: data.user.tenantId,
            updatedBy: data.user.id,
        },
        { where: { id: data.id }, returning: true ,transaction}
      );

      let rolePermissionRes = await db.dbInterface.models.RolePermissionMapping.destroy({
        where: { roleId : data.id },transaction
      });
      log.info("RolePermissionResponse (Destroy) --> ",JSON.stringify(rolePermissionRes));

      let permissions:any = [];
      let mappingRes:any;
      
      if(data.permissionIds?.length){
          data.permissionIds.forEach((id:any) => {
            permissions.push({
              roleId: data.id,
              permissionId: id
            });
          });
          log.info("Permission IDs  -- ",permissions);

        mappingRes = await db.dbInterface.models.RolePermissionMapping.bulkCreate(permissions,{transaction})
      }
      log.info("Role Permission Mapping Response  -- ",JSON.stringify(mappingRes));
      await transaction.commit();
      log.info("Role Updated Successfully",role);
      return role[1];
    }
    catch(error){
      await transaction.rollback();
      log.info("Error !!!",error);
      return error;
    }
  }

  async deleteRole(data: any) { 
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
        const attributesExclusions = [
            "createdBy",
            "updatedBy",
            "deletedAt",
            "createdAt",
            "updatedAt",
            ];
        const role: any = await db.dbInterface.models.Role.findOne({
            where: {
              id: data.id,
            },
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
              {
                  model: db.dbInterface.models.UserMapping,
                  attributes: {
                    exclude: attributesExclusions,
                  },
                },
            ],
              order: [['roleName', 'ASC']],
              limit: data.limit,
              offset: data.offset > 0 ? --data.offset * data.limit : 0
          });
          log.info(role.UserMappings);
          if (role.UserMappings?.length){
            log.info("Role has some assigned users");
            throw new Error("Can't delete the role as it has some users assigned");
          }
          else {
            const updateLog: any =await db.dbInterface.models.Role.update(
                {
                updatedBy: data.user.id,
                },
                {
                where: { id: data.id },transaction
                }
            );
            log.info("RoleUpdate --> ",JSON.stringify(updateLog));
            let rolePermissionRes = await db.dbInterface.models.RolePermissionMapping.destroy({
                where: { roleId : data.id },transaction
            });
            log.info("RolePermissionResponse (Destroy) --> ",JSON.stringify(rolePermissionRes));
            
            const role: any = await db.dbInterface.models.Role.destroy(
                {
                    where: { id: data.id },transaction
                }
                );
            log.info("Role (Destroy) --> ",JSON.stringify(role));
            await transaction.commit();
            return role;
        }        
    }
    catch(error){
      await transaction.rollback();
      log.info("Error !!!",error);
      throw error;
    }
  }  
}

export default new RoleDao();