import { Request, Response, NextFunction } from "express";
import { log } from '../classes/log.class';
import { RolePermissionMapping } from "../../../../database/models/rolePermissionMapping";
import { UserMapping } from "../../../../database/models/userMapping";
import { Permission } from "../../../../database/models/permission";
import { Role } from "../../../../database/models/role";
import { db } from '../../../../database/connection';
import permissionConst from "../utils/Constants";
import user from "../../../../database/models/user";

function permissions (permissionConst:any) {return async (req: any,res: any, next: NextFunction) => {

        // log.info("This is UserMappings DATA : ---- ",JSON.parse(JSON.stringify(req.user)))
        // log.info("--->>>--->>>",permissionConst);
        // log.info("--->>>--->>>",req.user);

        if(req.user.dataValues.roleId){

            const access:any = await db.dbInterface.models.Role.findOne({
                where: {
                    id: req?.user?.dataValues.roleId
                },
                include: [{ 
                    model: Permission,
                    where:{
                        key:permissionConst,
                    } 
                }],
            });
          // log.info("--->>>",access?.Permissions[0]?.dataValues)
            if (!access?.Permissions?.length) {
                log.error('You do not have the authorization to access this.');
                
                return res.status(403).json({statusCode: 403,message:"You do not have the authorization to access this."});
                
            }
            next();

        }else{
            return res.status(403).json({statusCode: 403,message:"You do not have the authorization to access this."});
        }
        
   
    
        }
  };

  export default permissions;


